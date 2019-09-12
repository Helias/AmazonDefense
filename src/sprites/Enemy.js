import { coordinates } from "../utils";

export default class Enemy {
    constructor(ctx, x, y, depth) {
        this.sprite = ctx.add.sprite(x, y)
        this.sprite.depth = depth

        this.speed = coordinates(0, 0.0075).y

        this.minY = coordinates(0, -0.1).y
        this.maxY = coordinates(0, 1.1).y

        this.active = false
    }

    playAnim(animId) {
        this.sprite.play(animId); 
    }

    update(ctx, spawnDifficulty) {
        if(this.active) {
            if(this.sprite.y < this.maxY) {
                this.sprite.y += this.speed
                // this.sprite.depth = this.sprite.y
            } else {
                this.active = false
            }
        } else {
            if(Math.random() > spawnDifficulty) {
                this.active = true
                this.sprite.y = this.minY
            }
        }
    }
}