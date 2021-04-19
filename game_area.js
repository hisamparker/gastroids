class GameArea {
    constructor(canvas) {
        this.canvas = canvas;
        //check that canvas is compatible w/browser
        this.ctx = canvas.getContext ? canvas.getContext('2d') : alert('upgrade now bish.');
        this.state = new States(this);
        this.size = {w: this.canvas.width, h: this.canvas.height};
        this.rafId = null;
        //use arrays to create groupings of elements so that I can render them all at once (instead of one-by-one)
        this.projectiles = [];
        this.enemies = [];
        this.wins = [];
        this.missiles = [];
        this.player = new Player (this, 100, 141, this.size.w/2 - 50, this.size.h/2 - 70.5, {x: 0, y: 0}, [{url: './images/eff.png'}, {url: './images/eff-win.png'}]);
        this.sounds = new Sounds(this);
        this.winIntervalId = null;
        this.enemiesIntervalId = null;
        this.boss = new Boss(this, 64, 64, this.size.w/2 - 25 , this.size.h/2 - 275, 0.02, [{url: './images/icecream-truck.png'}]);
        this.fart = new Fart(this, 60, 86, this.size.w / 2, this.size.h / 2, {x: 0, y: 0}, [{url: './images/fart.png'}]);

    }

    initGame(){
        //first request animation frame, only called once on updateGame
        requestAnimationFrame(() => this.updateGame());
        //calls spawn enemies once to kick of the interval
        this.spawnEnemies();
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
            x:Math.cos(angle),
            y:Math.sin(angle)
        };

        let num = Math.floor(Math.random() * 4 + 1);
        this.projectiles.push(new Projectile(this, 36, 36, this.size.w/2, this.size.h/2, velocity, [{url: `./images/marshmallow${num}.png`}]));
    }

    spawnMissile() {
        const angle = Math.atan2(this.size.h / 2 - this.boss.pos.y, this.size.w / 2 - this.boss.pos.x);    
        const velocity = {
            x:Math.cos(angle),
            y:Math.sin(angle)
        };

        let num = Math.floor(Math.random() * 2 + 1);
        this.missiles.push(new Missile(this, 36, 36, this.boss.pos.x, this.boss.pos.y, velocity, [{url: `./images/missile${num}.png`}]));
    }

    spawnEnemies() {
        this.enemiesIntervalId = setInterval(() => {
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
                this.enemies.push(new Enemy(this, 40, 40, x, y, velocity, [{url: `./images/icecream${num}.png`}]));
            }
        }, 2000);  
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
            this.wins.push(new WinProjectile(this, 60, 46, this.size.w/2 - this.player.size.w/2, this.size.h/2 - this.player.size.h/2, velocity, [{url: `./images/win${num}.png`}]));
        }, 100);  
    }

    updateGame(){
        this.rafId = requestAnimationFrame(() => this.updateGame());
        this.ctx.clearRect(0, 0, this.size.w, this.size.h);

        if (this.state.state === 'winning') {
            this.wins.forEach((win) => {
                win.update();    
            });
        }
        
        this.player.draw();
    
        this.state.frames += 1;
        
        if(this.state.state === 'playing') {this.state.levelUp();}

        if(this.state.state === 'playing' && this.state.level >= 2) {
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

            const distance = Math.hypot(projectile.pos.x - this.boss.pos.x, projectile.pos.y - this.boss.pos.y); {
                if (distance - this.boss.size.w/2 - projectile.size.w/2 < 1){
                    this.sounds.makeBossHitSound();
                    this.state.points += 100;
                    trackScore(this.state.points);
                    this.boss.lives -= 1;
                    this.boss.a > 0.2 ? this.boss.a -= 0.2 : this.boss.a = 0.2;
                    this.boss.f += 30;
                    setTimeout(() => {
                        this.projectiles.splice(index, 1);
                    }, 0);
                }
            }
        });

        this.enemies.forEach((enemy, index) => {
            enemy.update();
    
            const distance = Math.hypot(this.player.pos.x - enemy.pos.x, this.player.pos.y - enemy.pos.y);
            if (distance - enemy.size.w/2 - this.player.size.w/2 < 1 || distance - enemy.size.h/2 - this.player.size.h/2 < 1 ) {
                this.enemies.splice(index, 1);
                if (this.player.lives <= 1) {
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
                const distance = Math.hypot(projectile.pos.x - enemy.pos.x, projectile.pos.y - enemy.pos.y); {
                    if (distance - enemy.size.w/2 - projectile.size.w/2 < 1){
                        this.sounds.makeAchievementSound();
                        this.state.points += 10;
                        trackScore(this.state.points);
                        setTimeout(() => {
                            this.enemies.splice(index, 1);
                            this.projectiles.splice(projectileIndex, 1);
                        }, 0);
                    }
                }
            });
        });

        this.missiles.forEach((missile, index) => {
            missile.update();

            const distance = Math.hypot(this.player.pos.x - missile.pos.x, this.player.pos.y - missile.pos.y); 
            if (distance - missile.size.w/2 - this.player.size.w/2 < 1 || distance - missile.size.h/2 - this.player.size.h/2 < 1){
                this.missiles.splice(index, 1);
                if (this.player.lives <= 1) {
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
                const distance = Math.hypot(projectile.pos.x - missile.pos.x, projectile.pos.y - missile.pos.y); {
                    if (distance - missile.size.w/2 - projectile.size.w/2 < 1){
                        this.sounds.makeAchievementSound();
                        this.state.points += 50;
                        trackScore(this.state.points);
                        setTimeout(() => {
                            this.missiles.splice(index, 1);
                            this.projectiles.splice(projectileIndex, 1);
                        }, 0);
                    }
                }
            });
        });
        this.state.draw();
    }

    stopGame() {
        cancelAnimationFrame(this.rafId);
    }

    resetGame(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.state.frames = 0;
        this.state.level = 1;
        this.state.points = 0;
        this.player.lives = 10;
        this.enemies = [];
        this.projectiles = [];
        this.wins = [];
        clearInterval(this.winIntervalId);
        clearInterval(this.enemiesIntervalId);
        this.player.pos = {x: this.size.w/2, y: this.size.h/2};
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
