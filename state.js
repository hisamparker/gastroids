class State {
    constructor(gameArea) {
        this.gameArea = gameArea;
        this.canvas = gameArea.canvas;
        this.ctx = gameArea.ctx;
        this.frames = 0;
        this.framesAtLoss = 0;
        this.points = 0;
        this.level = 1;
        this.bossLevel = 0;
        this.enemySpawnRate = 60;
        this.state = 'playing';
        this.winSprite = new Image();
        this.winSprite.src = './images/you-win-2.png';
        this.loseSprite = new Image();
        this.loseSprite.src = './images/cheese.png';
    }

    draw() {
        if (this.state === 'winning') {
            this.ctx.drawImage(this.winSprite, this.gameArea.size.w/2 - 213.5, this.gameArea.size.h/2 + 60, 427, 87 );
        } else if (this.state === 'final') {
            this.ctx.drawImage(this.loseSprite, this.gameArea.size.w/2 - 208, this.gameArea.size.h/2 - 142, 416, 284);
        }
    }

    levelUp() {
        if(this.level === 5 && this.bossLevel === 1) {
            this.gameArea.sounds.makeGalactoseSound();
        }
        if (this.frames % 750 === 0 && this.state === 'playing'){
            this.level += 1;
            trackLevels(this.level);
            if(this.level >= 4 && this.state === 'playing') {
                this.enemySpawnRate = 60;
            } else {
                this.enemySpawnRate -= 3;
            }
        }
        if(this.frames > 250 && this.frames % this.enemySpawnRate === 0 && this.state === 'playing') {
            this.gameArea.spawnEnemies();
        }
    }

    win(){
        clearInterval(this.gameArea.winIntervalId);
        clearInterval(this.gameArea.enemiesIntervalId);
        this.gameArea.spawnWins(); 
        this.gameArea.sounds.backgroundMusic.pause();
        this.gameArea.sounds.makeWinSound();
        this.state = 'winning';
        this.gameArea.player.spriteIndex = 1;
        this.gameArea.player.size = {w: 200, h: 283};
        rainbow();
    }

    lose(){
        this.framesAtLoss = this.frames;
        clearInterval(this.gameArea.winIntervalId);
        clearInterval(this.gameArea.enemiesIntervalId);
        this.gameArea.sounds.backgroundMusic.pause();
        this.state = 'losing';
        this.gameArea.player.vel.y = -6;
        this.gameArea.sounds.makeFartSound();
        this.gameArea.fart.vel.y = 4;
        this.fart.pos = {x: this.gameArea.size.w/2, y: this.gameArea.size.h/2 + this.player.size.h/2};

    }

    final() {
        this.state = 'final';
    }
}