import { dist, clamp, coordinates } from '../utils'
import { Scene, Tilemaps } from 'phaser';

export default class Player {
    constructor(ctx, x, y) {
        // Sprite data
        this.sprite = ctx.add.sprite(x, y, 'player_idle_0')        

        this.sprite.scaleX = 1.2
        this.sprite.scaleY = 1.2

        this.minCoords = coordinates(0.1, 0.3)
        this.maxCoords = coordinates(0.9, 0.9)

        this.maxSpeed = coordinates(0.0075, 0.0075)
        this.speed = coordinates(0, 0)
        Object.assign(this.speed, this.maxSpeed)

        // Commands event
        var scene = ctx.scene.scene

        this.keyMoveForward = scene.input.keyboard.addKey('UP')
        this.keyMoveBackward = scene.input.keyboard.addKey('DOWN')
        this.keyMoveRight = scene.input.keyboard.addKey('RIGHT')
        this.keyMoveLeft = scene.input.keyboard.addKey('LEFT')
        this.keyAttack = scene.input.keyboard.addKey('space')

        // Attack cooldown
        this.attackCooldown = 0
        this.maxAttackCooldown = 20
    }


    attack(enemies, flip) {
        let ctx = this
        let minDist = coordinates(0.25, 0).x

        enemies.forEach(function(enemy) {
            if(enemy.active && 
              ((!flip && enemy.sprite.x < ctx.sprite.x) || (flip && enemy.sprite.x > ctx.sprite.x)) &&
               dist(ctx.sprite.x, ctx.sprite.y, enemy.sprite.x, enemy.sprite.y) <= minDist) {
                enemy.hp -= 50
                enemy.speed = 0;
            }
        })

        this.attackCooldown = this.maxAttackCooldown
    }

    playAnim(animId) {
        if(this.sprite.anims.currentAnim == null || this.sprite.anims.currentAnim.key != animId)
            this.sprite.play(animId)
    }

    update(ctx) {
        // Controls
        if(this.keyAttack.isDown) {
            this.speed.x = clamp(this.speed.x, 0, this.maxSpeed.x * 0.5)
            this.speed.y = clamp(this.speed.y, 0, this.maxSpeed.y * 0.5)

            if(this.attackCooldown == 0)
                this.attack(ctx.enemies, this.sprite.flipX)
        } else {
            this.speed.x = this.maxSpeed.x
            this.speed.y = this.maxSpeed.y
        }

        if(this.keyMoveForward.isDown) {
            this.sprite.y -= this.speed.y
            this.playAnim("player_walk")
        } else if(this.keyMoveBackward.isDown) {
            this.sprite.y += this.speed.y
            this.playAnim("player_walk")
        } else if(this.keyMoveRight.isDown) {
            this.sprite.x += this.speed.x
            this.sprite.flipX = true
            this.playAnim("player_walk")
        } else if(this.keyMoveLeft.isDown) {
            this.sprite.x -= this.speed.x
            this.sprite.flipX = false
            this.playAnim("player_walk")
        } else {
            this.playAnim("player_idle")
        }

        if(this.attackCooldown > 0)
            --this.attackCooldown

        // Position clamping
        this.sprite.x = clamp(this.sprite.x, this.minCoords.x, this.maxCoords.x)
        this.sprite.y = clamp(this.sprite.y, this.minCoords.y, this.maxCoords.y)

        this.sprite.depth = this.sprite.y
    }
}