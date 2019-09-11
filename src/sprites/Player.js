import {clamp, coordinates} from '../utils'

export default class Player {
    constructor(ctx, x, y, initialSprite) {
        this.sprite = ctx.add.sprite(x, y, `${initialSprite}`)        

        this.sprite.scaleX = 0.2
        this.sprite.scaleY = 0.2

        this.minCoords = coordinates(0.1, 0.2)
        this.maxCoords = coordinates(0.9, 0.7)
    }

    playAnim(animId) {
        this.sprite.play(animId)
    }

    update(ctx) {
        this.sprite.x = clamp(ctx.input.x, this.minCoords.x, this.maxCoords.x)
        this.sprite.y = clamp(ctx.input.y, this.minCoords.y, this.maxCoords.y)
    }
}