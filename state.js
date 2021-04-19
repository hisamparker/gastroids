class States {
    constructor(gameArea) {
        this.gameArea = gameArea;
        this.canvas = gameArea.canvas;
        this.ctx = gameArea.ctx;
        this.frames = 0;
        this.points = 0;
        this.level = 1;
        this.state = 'playing';
        this.sprites = {
            winning: {image: new Image(), url: './images/you-win-2.png', x: this.canvas.width/2 - 213.5, y: this.canvas.height/2 + 60, w: 427, h: 87 }, 
            final: {image: new Image(), url: './images/cheese.png', x: this.canvas.width/2 - 208, y: this.canvas.height/2 - 142, w: 416, h: 284}
            };
        this.sprites.winning.image.src = this.sprites.winning.url; 
        this.sprites.final.image.src = this.sprites.final.url; 
    }

    draw() {
        if (this.state in this.sprites) {
            this.ctx.drawImage(this.sprites[this.state].image, this.sprites[this.state].x, this.sprites[this.state].y, this.sprites[this.state].w, this.sprites[this.state].h);
        }
    }

    levelUp() {
        if (this.frames % 750 === 0 && this.state === 'playing'){
            this.level += 1;
            trackLevels(this.level);
        }
        if (this.level >= 3) {
            this.win();
        }
    }

    win(){
        this.gameArea.sounds.backgroundMusic.pause();
        this.gameArea.sounds.makeWinSound();
        this.state = 'winning';
        this.gameArea.player.spriteIndex = 1;
        this.gameArea.spawnWins();    
    }

    lose(){
        this.gameArea.sounds.backgroundMusic.pause();
        this.state = 'dying';
        this.gameArea.player.vel.y = -4;
        this.gameArea.sounds.makeFartSound();
        this.gameArea.fart.vel.y = 4;

    }

    final() {
        this.state = 'final';
    }
}