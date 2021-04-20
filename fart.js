class Fart extends Actor {
    constructor(gameArea, size, pos, velocity, sprites) {
        super(gameArea, size, pos, velocity, sprites);
    }

    update() {
        this.draw();
        
        this.pos.y += this.vel.y;
        this.vel.y *= 0.96;

        if (this.vel.y < 0.5 && this.pos.y < this.gameArea.canvas.height - 100) {
            this.vel.y = 0.5;
        }
        this.size.w += this.vel.y * 2;
        this.size.h += this.vel.y * 2;
    }
}
