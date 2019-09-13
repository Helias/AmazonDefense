import { dist, clamp, coordinates } from '../utils'
import { SETTINGS } from '../settings'

export default class Player {
    constructor(ctx, x, y) {
        // Sprite data
        this.sprite = ctx.add.sprite(x, y, 'player_idle_0')

        this.damage = 50

        this.sprite.scaleX = 1.2
        this.sprite.scaleY = 1.2

        this.minCoords = coordinates(0.02, 0.3)
        this.maxCoords = coordinates(0.98, 0.95)

        this.maxSpeed = coordinates(0.007, 0.007)
        this.speed = coordinates(0, 0)
        Object.assign(this.speed, this.maxSpeed)

        // Commands event
        var scene = ctx.scene.scene

        this.keyMoveForward = scene.input.keyboard.addKey('UP')
        this.keyMoveBackward = scene.input.keyboard.addKey('DOWN')
        this.keyMoveRight = scene.input.keyboard.addKey('RIGHT')
        this.keyMoveLeft = scene.input.keyboard.addKey('LEFT')
        this.keyAttack = scene.input.keyboard.addKey('space')

        this.hitSounds = []

        for(let i = 0; i < SETTINGS.hitSounds; ++i) {
            this.hitSounds.push(scene.sound.add(`hit${i}`))
        }

        // Attack cooldown
        this.attackCooldown = 0
        this.maxAttackCooldown = 25

        this.isY = null;
        this.isDown = null;
    }


    attack(enemies, flip) {
        let ctx = this
        let minDist = coordinates(0.15, 0).x

        let hit = false
        let damage = this.damage;

        enemies.forEach(function(enemy) {
            if(enemy.active && 
              ((!flip && enemy.sprite.x < ctx.sprite.x) || (flip && enemy.sprite.x > ctx.sprite.x)) &&
               dist(ctx.sprite.x, ctx.sprite.y, enemy.sprite.x, enemy.sprite.y) <= minDist) {
                enemy.hp -= damage
                enemy.speed = 0;
                
                hit = true
            }
        })

        this.attackCooldown = this.maxAttackCooldown

        return hit
    }

    playAnim(animId) {
          if(this.sprite.anims.currentAnim == null || this.sprite.anims.currentAnim.key != animId)
            this.sprite.play(animId)
    }

    update(ctx) {


        if (this.keyAttack.isDown
        || this.keyMoveForward.isDown
        || this.keyMoveBackward.isDown
        || this.keyMoveRight.isDown
        || this.keyMoveLeft.isDown) {
            // Controls
            if(this.keyAttack.isDown) {
                this.speed.x = clamp(this.speed.x, 0, this.maxSpeed.x * 0.5)
                this.speed.y = clamp(this.speed.y, 0, this.maxSpeed.y * 0.5)
                if(this.attackCooldown == 0) {
                    let hit = this.attack(ctx.enemies, this.sprite.flipX)

                    if(hit) {
                        let hitSoundId = Math.trunc((this.sprite.x + this.sprite.y) % this.hitSounds.length)

                        this.hitSounds[hitSoundId].play()
                    }
                }
            } else {
                this.speed.x = this.maxSpeed.x
                this.speed.y = this.maxSpeed.y
            }
           
            if(this.keyMoveForward.isDown) {
                this.sprite.y -= this.speed.y
                this.isY = true;
                this.isDown = false;
                
            } else if(this.keyMoveBackward.isDown) {
                
                this.sprite.y += this.speed.y
                this.isY = true;
                this.isDown = true;
                
            }
            
            if(this.keyMoveRight.isDown) {
                this.sprite.x += this.speed.x
                this.isY = false;
                
                // this.sprite.x += this.sprite.flipX ? 0 : -10 
                this.sprite.flipX = true
            } else if(this.keyMoveLeft.isDown) {
                this.sprite.x -= this.speed.x
                this.isY = false;
                
                // this.sprite.x += this.sprite.flipX ? -10 : 0
                this.sprite.flipX = false
            }

            if (this.keyAttack.isDown) {
                this.playAnim("player_attack")
            } else {
                if(this.isY == true) { 
                    if(this.isDown)   this.playAnim("player_walkDown")
                    else this.playAnim("player_walkUp")
                }
                else {
                    this.playAnim("player_walk")
                }
            }
        }
        else {
            if(this.isY == true) { 
                if(this.isDown) { this.playAnim("player_idle")}
                else {this.playAnim("player_idleUp")} // TODO: Add idleDown animation
            }
            else {
                this.playAnim("player_idle")
            }
            
        }

        if(this.attackCooldown > 0)
            --this.attackCooldown

        // Position clamping
        this.sprite.x = clamp(this.sprite.x, this.minCoords.x, this.maxCoords.x)
        this.sprite.y = clamp(this.sprite.y, this.minCoords.y, this.maxCoords.y)

        this.sprite.depth = this.sprite.y
    }
}