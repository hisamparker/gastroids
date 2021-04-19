class Actor {
    constructor(gameArea, w, h, x, y, velocity, sprites) {
        this.gameArea = gameArea;
        this.canvas = this.gameArea.canvas;
        this.ctx = gameArea.ctx;
        this.size = {w: w, h: h};
        this.pos = {x: x, y: y};
        this.vel = {x: velocity.x, y: velocity.y};
        this.sprites = sprites;
        this.spriteIndex = 0;
        for (let sprite of sprites) {
            sprite.image = new Image();
            sprite.image.src = sprite.url; 
        }
    }

    draw() {
        this.ctx.drawImage(this.sprites[this.spriteIndex].image, this.pos.x - this.size.w/2, this.pos.y - this.size.h/2, this.size.w, this.size.h);
    }

    update() {
        this.draw();
        this.pos.x = this.pos.x + this.vel.x;
        this.pos.y = this.pos.y + this.vel.y;
    }
}