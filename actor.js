class Actor {
    constructor(gameArea, size, pos, velocity, sprites) {
        this.gameArea = gameArea;
        this.canvas = this.gameArea.canvas;
        this.ctx = gameArea.ctx;
        this.size = {w: size.w, h: size.h};
        this.pos = {x: pos.x, y: pos.y};
        this.vel = {x: velocity.x, y: velocity.y};
        this.sprites = sprites;
        this.spriteIndex = 0;
        for (let sprite of sprites) {
            sprite.image = new Image();
            sprite.image.src = sprite.url; 
        }
        this.fallWhenGameOver = false;
    }

    draw() {
        this.ctx.drawImage(this.sprites[this.spriteIndex].image, this.pos.x - this.size.w/2, this.pos.y - this.size.h/2, this.size.w, this.size.h);
    }

    update() {
        this.draw();
        if(this.fallWhenGameOver === true && (this.gameArea.state.state === 'losing' || this.gameArea.state.state === 'winning' || this.gameArea.state.state === 'final')){
            this.pos.x = this.pos.x;
            this.pos.y += 5;
        } else {
            this.pos.x = this.pos.x + this.vel.x;
            this.pos.y = this.pos.y + this.vel.y;
        }
    }
}