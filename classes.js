class GameArea {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext ? canvas.getContext('2d') : alert('upgrade now bish.');
        this.size = {w: this.canvas.width, h: this.canvas.height};
        this.frames = 0;
        this.points = 0;
        this.level = 1;
        this.state = 'playing';
        this.rafId = null;
        this.projectiles = [];
        this.enemies = [];
        this.player = new Player (this.canvas, this.ctx, this);
    }

    initGame(){
        requestAnimationFrame(() => this.updateGame());
        this.spawnEnemies();

    }

    spawnProjectile(e) {
        const rect = e.target.getBoundingClientRect();
        const pointY = e.clientY -rect.top;
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
    
            this.enemies.push(new Enemy(this.canvas, this.ctx, x, y, velocity));
        }, 1000);
    }

    updateGame(){
        this.rafId = requestAnimationFrame(() => this.updateGame());
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.player.drawPlayer();
        if (this.state === 'playing') {
            this.frames += 1;
            this.levelUp();

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
                    this.player.lives -= 1;
                    trackLives(this.player.lives);
                    if(this.player.lives <= 0) {
                        this.loseGame();
                    }
                }
                
                //remove projectiles and enemies if they crash
                this.projectiles.forEach((projectile, projectileIndex) => {
                    const distance = Math.hypot(projectile.pos.x - enemy.pos.x, projectile.pos.y - enemy.pos.y); {
                        if (distance - enemy.size.w/2 - projectile.size.w/2 < 1){
                            this.points += 10;
                            keepScore(this.points);
                            console.log(this.points)
                            setTimeout(() => {
                                this.enemies.splice(index, 1);
                                this.projectiles.splice(projectileIndex, 1);
                            }, 0);
                        }
                    }
                });
            });
        }
    }

    levelUp() {
        if (this.frames % 500 === 0){
            this.level += 1;
            trackLevels(this.level);
        }
        if (this.level >= 10) {
            this.winGame();
        }
    }

    stopGame() {
        cancelAnimationFrame(this.rafId);
    }

    winGame(){
        //this.stopGame();
        this.state = 'winning';

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
        this.size = {w: 64, h: 64};
        this.fartSize = {w: 74, h: 74};
        this.vel = {x:0, y:0};
        this.pos = {x: this.canvas.width / 2, y: this.canvas.height / 2};
        this.fartVel = {x:0, y:0};
        this.fartPos = {x: this.canvas.width / 2 - this.size.w / 2, y: this.canvas.height / 2 - this.size.h / 2};
        this.lives = 2;
        this.eff = new Image();
        this.eff.src = './images/icecream-vendor.png';
        this.winEff = new Image();
        this.winEff.src = './images/icecreamshop.png';
        this.loseEff = new Image();
        this.loseEff.src = './images/melted-icecream.png'
    }

    drawPlayer() {
        if (this.gameArea.state === 'dying') {
            this.drawFart();
            this.pos.y += this.vel.y;
            this.vel.y *= 0.99; 
            if (this.vel.y > - 0.5) {
                this.vel.y = - 0.5
            }
            this.fartPos.y += this.fartVel.y;
            this.fartVel.y *= 0.97;
            this.fartSize.w += this.fartVel.y;
            this.fartSize.h += this.fartVel.y;
        }
        if (this.gameArea.state === 'winning') {
            this.ctx.drawImage(this.winEff, this.pos.x - this.size.w/2, this.pos.y - this.size.h/2, this.size.w, this.size.h);
        } else {
            this.ctx.drawImage(this.eff, this.pos.x - this.size.w/2, this.pos.y - this.size.h, this.size.w, this.size.h);
        } 
    }

    drawFart() {
        this.ctx.drawImage(this.loseEff, this.fartPos.x - this.fartSize.w/2, this.fartPos.y - this.fartSize.h/2, this.fartSize.w, this.fartSize.h);
    }

    checkCollision() {
        GameArea.updatePoints();
    }

    updateLives() {
       this.lives -= 1; 
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

    checkCollision() {
        
    }

}

class Enemy {
    constructor(canvas, ctx, x, y, velocity){
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
        this.pos.x = this.pos.x + this.vel.x;
        this.pos.y = this.pos.y + this.vel.y;
    }


}

class Boss {
    constructor(canvas, ctx){
        this.canvas = canvas;
        this.ctx = ctx;
        this.lives = 5;
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

