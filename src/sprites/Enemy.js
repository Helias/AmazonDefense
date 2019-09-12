import { dist, coordinates } from "../utils";

export default class Enemy {
    constructor(ctx, x, y, depth, trees) {
        this.sprite = ctx.add.sprite(x, y)
        this.sprite.depth = depth

        this.speedMax = coordinates(0, 0.0025).y
        this.speed = this.speedMax;

        this.minY = coordinates(0, -0.1).y
        this.maxY = coordinates(0, 1.1).y

        this.active = false
        this.acc=0

        this.trees = trees; 
        this.target = null; 
        this.hp = 100
    }

    playAnim(animId) {
        this.sprite.play(animId); 
    }

    update(ctx, spawnDifficulty) {
    
        if(this.active) {
            if(this.hp <= 0) {
                this.respawn(); 
            }

            if(this.sprite.y < this.maxY) {
                this.sprite.y += this.speed
                if(this.speed<this.speedMax){
                   this.speed = 0.2;
                    this.acc++;
                   if(this.acc==100){this.acc=0;this.speed = this.speedMax;}
                }
                // this.sprite.depth = this.sprite.y
                // look for the nearest tree
                // if (this.target == null) {
                //     this.target = this.getNearestTree(); 
                // }
                // this.walkToTarget(); 
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

    getNearestTree() {
        let target = null; 
        let min = null;
        for (let i = 0; i < this.trees.length; i++) {
            let x = this.trees[i].sprite.x;
            let y = this.trees[i].sprite.y;
            console.log(this.trees[i].sprite)
            console.log('tree x ' + x)
            console.log('tree y ' + y)
            console.log('enemy x ' + this.sprite.x)
            console.log('enemy y ' + this.sprite.y)
            let distance = dist(this.sprite.x, this.sprite.y, x, y);
            console.log(distance);
            min = min == null ? distance : min; 
            if (distance < min) {
                target = this.trees[i]; 
                min = distance; 
            }
        }
        return target; 
    }

    walkToTarget() {
        if (!this.isNear(this.target)) {
            this.sprite.x = this.sprite.x > this.target.x ? this.sprite.x -- : this.sprite.x ++; 
            this.sprite.y = this.sprite.y > this.target.y ? this.sprite.y -- : this.sprite.y ++; 
            return true; 
        }
        return false; 
    }

    isNear(tree) {
        let response = Math.abs(this.sprite.x - tree.x) > 3;
        return response &= Math.abs(this.sprite.y - tree.y) > 3;
    }

    respawn() {
        this.sprite.y = this.maxY
        this.hp = 100; 
    }
}