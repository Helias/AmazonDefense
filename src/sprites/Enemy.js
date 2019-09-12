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
        this.hp = 100
        this.trees = trees; 
        this.target = null; 
    }

    playAnim(animId) {
        this.sprite.play(animId); 
    }

    update(ctx, spawnDifficulty) {
        if(this.active) {
            // respawn the enemy
            if(this.hp <= 0) {
                this.respawn(); 
            }

            if (this.target == null) {
                this.target = this.getNearestTree(); 
            }
            this.walkToTarget();
            
            // hit 
            if(this.speed<this.speedMax){
                this.speed = 0.2;
                this.acc++;
                if(this.acc==100){
                    this.acc=0;
                    this.speed = this.speedMax;
                }
            }
             
        } else {
            if(Math.random() > spawnDifficulty) {
                this.active = true
                this.hp = 100
                this.sprite.y = this.minY
            }
        }
    }

    respawn() {
        this.sprite.y = this.minY;
        this.sprite.x = this.ALGORITMODELRITMO(); 
        this.hp = 100;
    }

    getNearestTree() {
        let target = null;
        let min = null;
        for (let i = 0; i < this.trees.length; i++) {
            let x = this.trees[i].sprite.x;
            let y = this.trees[i].sprite.y;
            let distance = dist(this.sprite.x, this.sprite.y, x, y);
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
            this.sprite.x = this.sprite.x > this.target.sprite.x ? this.sprite.x - this.speed : this.sprite.x + this.speed;
            this.sprite.y = this.sprite.y > this.target.sprite.y ? this.sprite.y - this.speed : this.sprite.y + this.speed;
            return true; 
        }
        return false;
    }

    isNear(tree) {
        return dist(this.sprite.x, this.sprite.y, tree.sprite.x, tree.sprite.y) < 10;  
    }

    ALGORITMODELRITMO() {
        let minPos = coordinates(0.02, 0.7)
        let maxPos = coordinates(0.98, 0.9)
        return Math.random() * (maxPos.x - minPos.x) + minPos.x
    }
}