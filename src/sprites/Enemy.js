import { dist, coordinates } from "../utils";
import { SETTINGS } from '../settings'

export default class Enemy {
    constructor(ctx, x, y, depth, trees) {
        this.sprite = ctx.add.sprite(x, y)
        this.sprite.depth = depth

        this.speedMax = coordinates(0, 0.0025).y
        this.speed = this.speedMax;

        this.minY = coordinates(0, -0.1).y
        this.maxY = coordinates(0, 1.1).y

        this.triggerY = coordinates(0, 0.65).y

        this.active = false
        this.hp = 100
        this.trees = trees; 
        this.deadTrees = 0;
        this.target = null; 

        var scene = ctx.scene.scene

        this.lowhitSounds = []

        for(let i = 0; i < SETTINGS.lowhitSounds; ++i) {
            this.lowhitSounds.push(scene.sound.add(`lowhit${i}`))
        }
    }

    playAnim(animId) {
        this.sprite.play(animId); 
    }

    update(ctx, spawnDifficulty) {
        if (this.active) {
            // respawn the enemy
            if (this.hp <= 0) {
                ctx.score++;
                this.respawn();
            }

            if (this.sprite.y >= this.triggerY) {
                this.speed = this.speedMax * 0.5

                if (this.target == null || this.target.hp <= 0 || this.target.isDead) {
                    this.target = this.getNearestTree();
                }

                if (this.target != null && this.target.hp > 0) {
                    this.walkToTarget();
                }

            } else {
                this.sprite.y += this.speed
            }

            
            // hit 
            if(this.speed < this.speedMax){
                this.speed += 0.05
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
        this.active = false
        this.sprite.y = this.minY;
        this.sprite.x = this.ALGORITMODELRITMO(); 
        this.hp = 100;
    }

    getNearestTree() {
        let target = null;
        let min = 300000;
        for (let i = 0; i < this.trees.length; i++) {
            let x = this.trees[i].sprite.x;
            let y = this.trees[i].sprite.y;
            let distance = dist(this.sprite.x, this.sprite.y, x, y);
            min = min == null ? distance : min;
            if (this.trees[i] != null && this.trees[i].hp > 0 && distance <= min) {
                target = this.trees[i];
                min = distance;
            }
        }

        return target;
    }

    walkToTarget() {

         if (this.target == null || this.target.hp <= 0 || !this.isNear(this.target)) {
            let xDiff = this.sprite.x - this.target.sprite.x
            let yDiff = this.sprite.y - this.target.sprite.y

            if(xDiff < 0) {
                this.sprite.x += Math.min(-xDiff, this.speed)
            } else {
                this.sprite.x -= Math.min(xDiff, this.speed)
            }

            if(yDiff < 0) {
                this.sprite.y += Math.min(-yDiff, this.speed)
            } else {
                this.sprite.y -= Math.min(yDiff, this.speed)
            }

            return true;
        }
         //attck tree
        if (this.target != null && this.target.hp > 0 && this.deadTrees <= 25) {
            this.attackTree();

            let lowhitSoundId = Math.trunc((this.sprite.x + this.sprite.y) % this.lowhitSounds.length)
            this.lowhitSounds[lowhitSoundId].play()
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

    attackTree() {
        this.target.hp -= 1;

        //animazione dell'albero ...

        if (this.target == null || this.target.hp <= 0) {
            this.target.sprite.destroy();
            this.target.isDead = true
            this.deadTrees++;
            this.target = null;
        }

    }
}