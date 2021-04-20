class GameArea {
    constructor(canvas) {
        this.canvas = canvas;
        //check that canvas is compatible w/browser
        this.ctx = canvas.getContext ? canvas.getContext('2d') : alert('upgrade now bish.');
        this.state = new State(this);
        this.level = this.state.level;
        this.size = {w: this.canvas.width, h: this.canvas.height};
        this.rafId = null;
        //use arrays to create groupings of elements so that I can render them all at once (instead of one-by-one)
        this.projectiles = [];
        this.enemies = [];
        this.wins = [];
        this.missiles = [];
        this.player = new Player (this, {w: 100, h: 141}, {x: this.size.w/2, y: this.size.h/2}, {x: 0, y: 0}, [{url: './images/eff.png'}, {url: './images/eff-win.png'}]);
        this.player.draw();
        this.sounds = new Sounds(this);
        this.winIntervalId = null;
        this.enemiesIntervalId = null;
        this.boss = new Boss(this, {w: 64, h: 64}, {x: this.size.w/2 - 25 , y: this.size.h/2 - 275}, 0.02, [{url: './images/icecream-truck.png'}]);
        if(this.state.state === 'playing' && this.state.level >= 5) {
            this.boss.draw();
        }
        this.fart = new Fart(this, {w: 60, h: 86}, {x: this.size.w/2, y: this.size.h/2 + this.player.size.h/2}, {x: 0, y: 0}, [{url: './images/fart.png'}]);
        if(this.state.state === 'losing') {this.fart.draw();}

    }

    initGame(){
        //first request animation frame, only called once on updateGame
        requestAnimationFrame(() => this.updateGame());
        //calls spawn enemies once to kick of the interval
        //display levels, lives, and score on start
        trackLevels(this.state.level);
        trackLives(this.player.lives);
        trackScore(this.state.points);
        this.sounds.makeBackgroundMusic();

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
            x:Math.cos(angle) * 4,
            y:Math.sin(angle) * 4
        };

        let num = Math.floor(Math.random() * 4 + 1);

        this.projectiles.push(new Actor(this, {w: 36, h: 36}, {x: this.size.w/2, y: this.size.h/2}, velocity, [{url: `./images/marshmallow${num}.png`}]));
    }

    spawnMissile() {
        const angle = Math.atan2(this.size.h / 2 - this.boss.pos.y, this.size.w / 2 - this.boss.pos.x);    
        const velocity = {
            x:Math.cos(angle),
            y:Math.sin(angle)
        };

        let num = Math.floor(Math.random() * 2 + 1);
        this.missiles.push(new Actor(this, {w: 36, h: 36}, {x: this.boss.pos.x, y: this.boss.pos.y}, velocity, [{url: `./images/missile${num}.png`}]));
        this.missiles[this.missiles.length - 1].fallWhenGameOver = true;
    }

    spawnEnemies() {
        if (this.state.state === 'playing') {
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

            let num = Math.floor(Math.random() * 8 + 1);
            
            this.enemies.push(new Actor(this, {w: 40, h: 40}, {x: x, y: y}, velocity, [{url: `./images/icecream${num}.png`}]));
            this.enemies[this.enemies.length - 1].fallWhenGameOver = true;
        }
    }

    spawnWins() {
        this.winIntervalId = setInterval(() => {
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

            let num = Math.floor(Math.random() * 8 + 1);
            this.wins.push(new Actor(this, {w: 60, h: 46}, {x: this.size.w/2, y: this.size.h/2}, velocity, [{url: `./images/win${num}.png`}]));
        }, 50);  
    }

    calculateDistance (actor1, actor2) {
        return Math.hypot((actor1.pos.x ) - (actor2.pos.x ), (actor1.pos.y )  - (actor2.pos.y ));
    }

    collisionDetected (actor1, actor2) {
        const distance = this.calculateDistance(actor1, actor2);
        const actor1SmallestBoundary = Math.min(actor1.size.w, actor1.size.h);
        const actor2SmallestBoundary = Math.min(actor2.size.w, actor2.size.h);
        console.log("distance : " +distance);
        return (distance < Math.max(actor1SmallestBoundary, actor2SmallestBoundary)/2)
    }

    updateGame(){
        this.rafId = requestAnimationFrame(() => this.updateGame());
        this.ctx.clearRect(0, 0, this.size.w, this.size.h);

        if (this.state.state === 'winning') {
            this.wins.forEach((win) => {
                win.update();    
            });
        }

        this.player.update();
    
        this.state.frames += 1;

        if(this.state.state === 'losing') {this.fart.update();}
        
        if(this.state.state === 'playing') {this.state.levelUp();}

        if(this.state.frames - this.state.framesAtLoss > 200 && this.state.state === 'losing') {this.state.final();}

        if(this.state.state === 'playing' && this.state.level >= 5) {
            this.boss.update();
        }


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

            if (this.collisionDetected(projectile, this.boss)){
                this.sounds.makeBossHitSound();
                this.state.points += 100;
                trackScore(this.state.points);
                this.boss.lives -= 1;
                if(this.boss.lives === 0 && this.state.state !== 'losing') {this.state.win();} 
                this.boss.a > 0.3 ? this.boss.a -= 0.2 : this.boss.a = 0.3;
                this.boss.f < 280 ? this.boss.f += 30 : this.boss.f = 280;
                setTimeout(() => {
                    this.projectiles.splice(index, 1);
                }, 0);        
            }
        });

        this.enemies.forEach((enemy, index) => {
            enemy.update();
    
            if (this.collisionDetected(this.player, enemy)) {
                this.enemies.splice(index, 1);
                if (this.player.lives <= 1 && this.state.state !== 'winning') {
                    this.state.lose();
                }
                if (this.player.lives > 0) {
                    this.sounds.makeOuchSound(this);
                    this.player.lives -= 1;
                    trackLives(this.player.lives);
                } 
            }
        
            
            //remove projectiles and enemies if they crash
            this.projectiles.forEach((projectile, projectileIndex) => {
                if (this.collisionDetected(projectile, enemy)){
                    this.sounds.makeAchievementSound();
                    this.state.points += 10;
                    trackScore(this.state.points);
                    setTimeout(() => {
                        this.enemies.splice(index, 1);
                        this.projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
            });
        });

        this.missiles.forEach((missile, index) => {
            missile.update();

            if (this.collisionDetected(this.player, missile)){
                this.missiles.splice(index, 1);
                if (this.player.lives <= 1 && this.state.state !== 'winning') {
                    this.state.lose();
                }
                if (this.player.lives > 0) {
                    this.sounds.makeOuchSound();
                    this.player.lives -= 1;
                    trackLives(this.player.lives);
                } 
            }

            //remove projectiles and missiles if they crash
            this.projectiles.forEach((projectile, projectileIndex) => {
                if (this.collisionDetected(projectile, missile)){
                    this.sounds.makeAchievementSound();
                    this.state.points += 50;
                    trackScore(this.state.points);
                    setTimeout(() => {
                        this.missiles.splice(index, 1);
                        this.projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
            });
        });
        this.state.draw();
    }

    stopGame() {
        cancelAnimationFrame(this.rafId);
    }

    resetGame(){
        this.stopGame();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.state.frames = 0;
        this.state.level = 1;
        this.state.points = 0;
        this.player.lives = 10;
        this.player.vel = {x: 0, y: 0};
        this.player.size = {w: 100, h: 141};
        this.player.spriteIndex = 0;
        this.enemies = [];
        this.projectiles = [];
        this.wins = [];
        this.missiles = [];
        clearInterval(this.winIntervalId);
        clearInterval(this.enemiesIntervalId);
        this.player.pos = {x: this.size.w/2, y: this.size.h/2};
        this.boss.pos = {x: this.size.w/2 - 25, y:this.size.h/2 - 275};
        this.boss.radians = 0;
        this.boss.lives = 10;
        this.boss.f = 100;
        this.boss.a = 1;
        this.fart.size = {w: 60, h: 86};
        this.fart.vel = {x:0, y:0};
        this.fart.pos = {x: this.size.w/2, y: this.size.h/2};
        this.state.state = 'playing';
        trackLives(this.player.lives);
        trackScore(this.state.points);
        trackLevels(this.state.level);
        setTimeout(() => {this.initGame();}, 2000);

    }

}
