class Projectile extends Actor {
    constructor(gameArea, w, h, x, y, velocity, sprites) {
        super(gameArea, w, h, x, y, velocity, sprites);   
    }

    update() {
        this.draw();
        this.pos.x = this.pos.x + this.vel.x * 4;
        this.pos.y = this.pos.y + this.vel.y * 4;
    }
}