class Boss extends Actor {
    constructor(gameArea, size, pos, vel, sprites) {
        super(gameArea, size, pos, vel, sprites);
        this.lives = 10;
        this.vel = vel;
        this.radians = 0;
        this.a = 1;
        this.f = 100;     
    }

    modDraw() {
        if(this.lives > 0) {
            this.ctx.globalAlpha = this.a;
            this.ctx.filter = `brightness(${this.f}%)`;
            this.draw();
            this.ctx.filter = `brightness(100%)`;
            this.ctx.globalAlpha = 1.0;

            if (this.gameArea.state.frames % 225 === 0 ) {this.gameArea.spawnMissile();}
        }
    }

    update() {
        this.modDraw();
        //move position over time
        this.radians += this.vel;
        this.pos.x = this.pos.x + Math.cos(this.radians) * 7;
        this.pos.y = this.pos.y + Math.sin(this.radians) * 5;
    }
}