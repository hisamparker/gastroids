class Player extends Actor {
    constructor(gameArea, size, pos, velocity, sprites) {
        super(gameArea, size, pos, velocity, sprites);
        this.lives = 10;   
    }

    update() {
        this.draw();
        if(this.gameArea.state.state === 'losing') {
            this.pos.y += this.vel.y;
            this.vel.y *= 0.99; 
            if (this.vel.y > - 0.75) {
                this.vel.y = - 0.75;
            }
        }
    }
}