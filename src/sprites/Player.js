import {clamp, coordinates} from '../utils'
import { Scene, Tilemaps } from 'phaser';

export default class Player {
    constructor(ctx, x, y) {
        // Sprite data
        this.sprite = ctx.add.sprite(x, y, 'player_idle_0')        

        this.sprite.scaleX = 0.2
        this.sprite.scaleY = 0.2

        this.minCoords = coordinates(0.1, 0.3)
        this.maxCoords = coordinates(0.9, 0.9)

        this.speed = coordinates(0.01, 0.01)

        // Commands event
        var scene = ctx.scene.scene

        this.keyMoveForward = scene.input.keyboard.addKey('W')
        this.keyMoveBackward = scene.input.keyboard.addKey('S')
        this.keyMoveRight = scene.input.keyboard.addKey('D')
        this.keyMoveLeft = scene.input.keyboard.addKey('A')
        this.keyAttack = scene.input.keyboard.addKey('space')

        // Attack cooldown
        this.attackCooldown = 0
        this.maxAttackCooldown = 60
    }

    playAnim(animId) {
        this.sprite.play(animId)
    }

    attack(flip) {
        console.log("Attack")
        this.attackCooldown = this.maxAttackCooldown
    }

    update(ctx) {
        // this.sprite.x = clamp(ctx.input.x, this.minCoords.x, this.maxCoords.x)
        // this.sprite.y = clamp(ctx.input.y, this.minCoords.y, this.maxCoords.y)

        // Controls
        if(this.keyMoveForward.isDown) {
            this.sprite.y -= this.speed.y
        } else if(this.keyMoveBackward.isDown) {
            this.sprite.y += this.speed.y
        } else if(this.keyMoveRight.isDown) {
            this.sprite.x += this.speed.x
            this.sprite.flipX = false
        } else if(this.keyMoveLeft.isDown) {
            this.sprite.x -= this.speed.x
            this.sprite.flipX = true
        } 
        
        if(this.keyAttack.isDown && this.attackCooldown == 0) {
            this.attack(this.sprite.flipX)
        }

        if(this.attackCooldown > 0)
            --this.attackCooldown

        // Position clamping
        this.sprite.x = clamp(this.sprite.x, this.minCoords.x, this.maxCoords.x)
        this.sprite.y = clamp(this.sprite.y, this.minCoords.y, this.maxCoords.y)
    }
}