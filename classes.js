class GameArea {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext ? canvas.getContext('2d') : alert('upgrade now bish.');
        this.size = {w: this.canvas.width, h: this.canvas.height};
        this.frames = 0;
        this.score = 0;
        this.level = 0;
        this.rafId = null;
    }

    initGame(){

    }

    updateGame(){

    }

    updatePoints(){

    }

    stopGame() {
        cancelAnimationFrame(this.rafId);
    }

    winGame(){
        this.stopGame();

    }

    loseGame(){
        this.stopGame();

    }

    resetGame(){
        this.stopGame();
        this.initGame();

    }

    isOutside(x, y, height, width) {
        return this.pos.x + width < 0 || this.pos.x - width > this.canvas.width || this.pos.y + height < 0 || this.pos.y - height > this.canvas.height;
    }

    garbageRemoval(arr) {
        for (let el of arr) {
            arr.splice(arr.indexOf(el), 1);
          }
    }

}

class Player {
    constructor(canvas, ctx){
        this.canvas = canvas;
        this.ctx = ctx;
        this.size = {w: null, h: null};
        this.pos = {x: canvas.width / 2 - this.width / 2, y:canvas.height / 2 - this.height / 2};
        this.lives = 10;
        this.eff = new Image();
        this.eff.src = null;
        this.winEff = new Image();
        this.winEff.src = null;
    }

    drawPlayer() {
        this.ctx.drawImage(this.eff, this.pos.x, this.pos.y, this.size.w, this.size.h);
    }

    checkCollision() {
        GameArea.updatePoints();
    }

    updateLives() {
       this.lives -= 1; 
    }

    isDead() {
        return lives <= 0;
    }



}

class Projectile {
    constructor(canvas, ctx){
        this.canvas = canvas;
        this.ctx = ctx;
        this.projectiles = [];
        this.size = {w: null, h: null};
        this.pos = {x: 0, y: 0};
        this.vel = {x: 0, y: 0};
        this.eff = new Image();
        this.eff.src = null;
    }

    drawProjectile() {
        this.ctx.drawImage(this.eff, this.pos.x, this.pos.y, this.size.w, this.size.h);
    }

    checkCollision() {
        
    }

    //maybe in game area
    isOutside() {
        return this.pos.x < 0 || this.pos.x > this.canvas.width || this.pos.y < 0 || this.pos.y > this.canvas.height;
    }

}

class Enemy {
    constructor(canvas, ctx){
        this.canvas = canvas;
        this.ctx = ctx;
        this.enemies = [];
        this.size = {w: null, h: null};
        this.pos = {x: 0, y: 0};
        this.vel = {x: 0, y: 0};
        this.eff = new Image();
        this.eff.src = null;
    }

    drawEnemy() {
        this.ctx.drawImage(this.eff, this.pos.x, this.pos.y, this.size.w, this.size.h);
    }

    //maybe in game area
    isOutside() {
        return this.pos.x < 0 || this.pos.x > this.canvas.width || this.pos.y < 0 || this.pos.y > this.canvas.height;
    }

}

class Boss {
    constructor(canvas, ctx){
        this.canvas = canvas;
        this.ctx = ctx;
        this.lives = 5;
        this.size = {w: null, h: null};
        this.pos = {x: 0, y: 0};
        this.vel = {x: 0, y: 0};
        this.eff = new Image();
        this.eff.src = null;
    }

    drawBoss() {
        this.ctx.drawImage(this.eff, this.pos.x, this.pos.y, this.size.w, this.size.h);
    }

    updateLives(){
        this.lives -= 1; 
     }

    isDead() {
        return lives <= 0;
    }
}