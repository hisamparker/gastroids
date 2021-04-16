class GameArea {
    constructor(canvas) {
        this.canvas = canvas;
        //check that canvas is compatible w/browser
        this.ctx = canvas.getContext ? canvas.getContext('2d') : alert('upgrade now bish.');
        this.size = {w: this.canvas.width, h: this.canvas.height};
        this.frames = 0;
        this.points = 0;
        this.level = 1;
        this.state = 'playing';
        this.rafId = null;
        //use arrays to create groupings of elements so that I can render them all at once (instead of one-by-one)
        this.projectiles = [];
        this.enemies = [];
        this.wins = [];
        this.player = new Player (this.canvas, this.ctx, this);
    }

    initGame(){
        //first request animation frame, only called once on updateGame
        requestAnimationFrame(() => this.updateGame());
        //calls spawn enemies once to kick of the interval
        this.spawnEnemies();
        //display levels, lives, and score on start
        trackLevels(this.level);
        trackLives(this.player.lives);
        trackScore(this.points);

    }

    //called in app.js, on click, new projectiles are spawned, click event is passed to func to get click position
    spawnProjectile(e) {
        //getBoundingClientRect() returns a DOMRect object, this gets the size and position of an element's bounding box, relative to the viewport
        const rect = e.target.getBoundingClientRect();
        //the event position is relative to the entire viewport, rect.top is equal to the difference btw the top of the vp and the top of the (main)element surrounding my canvas, so I need to subtract that from e.clientY to get click event position relative to my canvas (client left gets the diff btw the left of the vp and the left of my element)
        const pointY = e.clientY - rect.top;
        const pointX = e.clientX - rect.left;
        const angle = Math.atan2(pointY - this.size.h/2, pointX - this.size.w/2);
        const velocity = {
            x:Math.cos(angle),
            y:Math.sin(angle)
        };
    
        this.projectiles.push(new Projectile(this.canvas, this.ctx, this.size.w/2, this.size.h/2, velocity));
    }

    spawnEnemies() {
        setInterval(() => {
            let x, y;
            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? 0 - 20 : this.size.w + 20;
                y = Math.random() * this.size.h;
            } else {
                x = Math.random() * this.size.w;
                y = Math.random() < 0.5 ? 0 - 20 : this.size.h + 20;
            } 
            //to move towards an object take the end goal and subtract current location
            const angle = Math.atan2(this.size.h / 2 - y, this.size.w / 2 - x);
            
            const velocity = {
            x:Math.cos(angle),
            y:Math.sin(angle)
            };
            if (this.state === 'playing') {
                this.enemies.push(new Enemy(this.canvas, this.ctx, x, y, velocity, this));
            }
        }, 1000);  
    }

    spawnWins() {
        setInterval(() => {
            let pointX, pointY;
            if (Math.random() < 0.5) {
                pointX = Math.random() < 0.5 ? 0 - 20 : this.size.w + 20;
                pointY = Math.random() * this.size.h;
            } else {
                pointX = Math.random() * this.size.w;
                pointY = Math.random() < 0.5 ? 0 - 20 : this.size.h + 20;
            } 

            const angle = Math.atan2(pointY - this.size.h/2, pointX - this.size.w/2);
            const velocity = {
                x:Math.cos(angle),
                y:Math.sin(angle)
            };
            this.wins.push(new Win(this, velocity));
        }, 10);  
    }

    updateGame(){
        this.rafId = requestAnimationFrame(() => this.updateGame());
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.state === 'winning') {
            this.wins.forEach((win) => {
                win.update();    
            });
        }
        
        this.player.drawPlayer();
    
        this.frames += 1;
        if(this.state === 'playing') {this.levelUp();}

        this.projectiles.forEach((projectile, index) => {
            projectile.update();
            //remove offscreen projectiles
            if(
                projectile.pos.x + projectile.size.w < 0 || 
                projectile.pos.x - projectile.size.w > this.size.w || 
                projectile.y + projectile.size.h < 0 || 
                projectile.y - projectile.size.h > this.size.h) {
                setTimeout(() => {
                    this.projectiles.splice(index, 1);
                }, 0);
            }
        });

        this.enemies.forEach((enemy, index) => {
            enemy.update();
    
            const distance = Math.hypot(this.player.pos.x - enemy.pos.x, this.player.pos.y - enemy.pos.y); 
            if (distance - enemy.size.w/2 - this.player.size.w/2 < 1){
                this.enemies.splice(index, 1);
                if (this.player.lives <= 1) {
                    this.loseGame();
                }
                if (this.player.lives > 0) {
                    this.player.lives -= 1;
                    trackLives(this.player.lives);
                } 
            }
            
            //remove projectiles and enemies if they crash
            this.projectiles.forEach((projectile, projectileIndex) => {
                const distance = Math.hypot(projectile.pos.x - enemy.pos.x, projectile.pos.y - enemy.pos.y); {
                    if (distance - enemy.size.w/2 - projectile.size.w/2 < 1){
                        this.points += 10;
                        trackScore(this.points);
                        setTimeout(() => {
                            this.enemies.splice(index, 1);
                            this.projectiles.splice(projectileIndex, 1);
                        }, 0);
                    }
                }
            });
        });
    
    }

    levelUp() {
        if (this.frames % 500 === 0 && this.state === 'playing'){
            this.level += 1;
            trackLevels(this.level);
        }
        if (this.level >= 2) {
            this.winGame();
        }
    }

    stopGame() {
        cancelAnimationFrame(this.rafId);
    }

    winGame(){
        //this.stopGame();
        this.state = 'winning';
        this.spawnWins();
        
    }

    loseGame(){
        //this.stopGame();
        this.state = 'dying';
        this.player.vel.y = -4;
        this.player.fartVel.y = 4;

    }

    resetGame(){
        this.stopGame();
        this.initGame();

    }

}

class Player {
    constructor(canvas, ctx, gameArea){
        this.gameArea = gameArea;
        this.canvas = canvas;
        this.ctx = ctx;
        this.size = {w: 100, h: 141};
        this.fartSize = {w: 60, h: 86};
        this.vel = {x:0, y:0};
        this.pos = {x: this.canvas.width / 2, y: this.canvas.height / 2};
        this.fartVel = {x:0, y:0};
        this.fartPos = {x: this.canvas.width / 2, y: this.canvas.height / 2};
        this.lives = 2;
        this.eff = new Image();
        this.eff.src = './images/eff.png';
        this.winEff = new Image();
        this.winEff.src = './images/eff-win.png';
        this.fart = new Image();
        this.fart.src = './images/fart.png';
        this.loseTextEff = new Image();
        this.loseTextEff.src = './images/cheese.png';
    }

    drawPlayer() {
        if (this.gameArea.state === 'dying') {
            if(this.fartPos.y > 484) {
                this.drawLoseText();
            } else {
                this.drawFart();
                this.pos.y += this.vel.y;
                this.vel.y *= 0.99; 
                if (this.vel.y > - 0.5) {
                    this.vel.y = - 0.5;
                }
                this.fartPos.y += this.fartVel.y;
                this.fartVel.y *= 0.96;
                if (this.fartVel.y < 0.5 && this.fartPos.y < this.canvas.height - 100) {
                    this.fartVel.y = 0.5;
                }
                this.fartSize.w += this.fartVel.y * 2;
                this.fartSize.h += this.fartVel.y * 2;
            }
        }
        if (this.gameArea.state === 'winning') {
            this.ctx.drawImage(this.winEff, this.pos.x - 100, this.pos.y - 141.5, 200, 283);
        } else {
            this.ctx.drawImage(this.eff, this.pos.x - this.size.w/2, this.pos.y - this.size.h/2, this.size.w, this.size.h);
        } 
    }

    drawFart() {
        this.ctx.drawImage(this.fart, this.fartPos.x - this.fartSize.w/2 + 20, this.fartPos.y - this.fartSize.h/2, this.fartSize.w, this.fartSize.h);
    }

    drawLoseText() {
            this.ctx.drawImage(this.loseTextEff, this.canvas.width/2 - 208, this.canvas.height/2 - 142, 416, 284);
    }

    isDead() {
        return lives <= 0;
    }

}

class Projectile {
    constructor(canvas, ctx, x, y, velocity){
        this.canvas = canvas;
        this.ctx = ctx;
        this.size = {w: 30, h: 30};
        this.pos = {x: x, y: y};
        this.vel = velocity;
        this.eff = new Image();
        this.num = Math.floor(Math.random() * 3 + 1);
        this.eff.src = `./images/marshmallow${this.num}.png`;
    }

    drawProjectile() {
        this.ctx.drawImage(this.eff, this.pos.x, this.pos.y, this.size.w, this.size.h);
    }

    update() {
        this.drawProjectile();
        this.pos.x = this.pos.x + this.vel.x;
        this.pos.y = this.pos.y + this.vel.y;
    }

}

class Enemy {
    constructor(canvas, ctx, x, y, velocity, gameArea){
        this.gameArea = gameArea;
        this.canvas = canvas;
        this.ctx = ctx;
        this.size = {w: 40, h: 40};
        this.pos = {x: x, y: y};
        this.vel = velocity;
        this.eff = new Image();
        this.num = Math.floor(Math.random() * 8 + 1);
        this.eff.src = `./images/icecream${this.num}.png`;
    }

    drawEnemy() {
        this.ctx.drawImage(this.eff, this.pos.x, this.pos.y, this.size.w, this.size.h);
    }

    update() {
        this.drawEnemy();
        if (this.gameArea.state === 'dying' || this.gameArea.state === 'winning') {
            this.pos.x = this.pos.x;
            this.pos.y += 5;
        } else {
            this.pos.x = this.pos.x + this.vel.x;
            this.pos.y = this.pos.y + this.vel.y;
        }
    }


}

class Win {
    constructor (gameArea, velocity) {
        this.gameArea = gameArea;
        this.canvas = this.gameArea.canvas;
        this.ctx = this.gameArea.ctx;
        this.size = {w: 60, h: 46};
        this.pos = {x: gameArea.size.w/2, y: gameArea.size.h/2};
        this.vel = velocity;
        this.eff = new Image();
        this.num = Math.floor(Math.random() * 8 + 1);
        this.eff.src = `./images/win${this.num}.png`;
        this.winTextEff = new Image();
        this.winTextEff.src = './images/you-win-2.png';
    }

    drawWin() {
        this.ctx.drawImage(this.eff, this.pos.x - 40, this.pos.y - 70.75, this.size.w, this.size.h);
        this.drawWinText();
    }

    drawWinText() {
        this.ctx.drawImage(this.winTextEff, this.canvas.width/2 - 213.5, this.canvas.height/2 + 60, 427, 87);
    }

    update() {
        this.drawWin();
        this.pos.x = this.pos.x + this.vel.x;
        this.pos.y = this.pos.y + this.vel.y;
    }
}

class Boss {
    constructor(canvas, ctx){
        this.canvas = canvas;
        this.ctx = ctx;
        this.lives = 10;
        this.size = {w: null, h: null};
        this.pos = {x: 0, y: 0};
        this.vel = {x: 0, y: 0};
        this.eff = new Image();
        this.eff.src = null;
    }

    drawBoss() {
        this.ctx.drawImage(this.eff, this.pos.x, this.pos.y, this.size.w, this.size.h);
    }

    updateLives(){
        this.lives -= 1; 
     }

    isDead() {
        return lives <= 0;
    }
}

