class Fart extends Actor {
    constructor(gameArea, w, h, x, y, velocity, sprites) {
        super(gameArea, w, h, x, y, velocity, sprites);
    }

    update() {
        if(this.pos.y > 484) {
            this.gameArea.state.final();        
        } else {
            this.draw();
            
            this.pos.y += this.vel.y;
            this.vel.y *= 0.96;

            if (this.vel.y < 0.5 && this.pos.y < this.gameArea.canvas.height - 100) {
                this.vel.y = 0.5;
            }
            this.w += this.vel.y * 2;
            this.h += this.vel.y * 2;
        }
    }
}
