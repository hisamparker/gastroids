class Enemy extends Actor {
    constructor(gameArea, w, h, x, y, velocity, sprites) {
        super(gameArea, w, h, x, y, velocity, sprites); 
    }

    update() {
        this.draw();
        if (this.gameArea.state.state === 'losing' || this.gameArea.state.state === 'winning') {
            this.pos.x = this.pos.x;
            this.pos.y += 5;
        } else {
            this.pos.x = this.pos.x + this.vel.x;
            this.pos.y = this.pos.y + this.vel.y;
        }
    }
}