import { coordinates } from "../utils";

export default class Enemy {
    constructor(ctx, x, y, depth) {
        this.sprite = ctx.add.sprite(x, y)
        this.sprite.depth = depth

        this.speedMax = coordinates(0, 0.0025).y
        this.speed = this.speedMax;

        this.minY = coordinates(0, -0.1).y
        this.maxY = coordinates(0, 1.1).y

        this.active = false
        this.acc=0
        this.hp = 100
    }

    playAnim(animId) {
        this.sprite.play(animId); 
    }

    update(ctx, spawnDifficulty) {
    
        if(this.active) {
            if(this.hp <= 0) {
                this.sprite.y = this.maxY
            }

            if(this.sprite.y < this.maxY) {
                this.sprite.y += this.speed
                if(this.speed<this.speedMax){
                   this.speed = 0.2;
                    this.acc++;
                   if(this.acc==100){this.acc=0;this.speed = this.speedMax;}
                }
                // this.sprite.depth = this.sprite.y
            } else {
                this.active = false
            }
        } else {
            if(Math.random() > spawnDifficulty) {
                this.active = true
                this.hp = 100
                this.sprite.y = this.minY
            }
        }
    }
}