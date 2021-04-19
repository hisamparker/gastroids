class Player extends Actor {
    constructor(gameArea, w, h, x, y, velocity, sprites) {
        super(gameArea, w, h, x, y, velocity, sprites);
        this.lives = 4;   
    }

    update() {
        if(this.gameArea.state === 'losing') {
            this.pos.y += this.vel.y;
            this.vel.y *= 0.99; 
            if (this.vel.y > - 0.5) {
                this.vel.y = - 0.5;
            }
        }
    }
}