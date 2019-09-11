export default class Player {
    constructor(game, x, y, initialSprite) {
        this.sprite = game.add.sprite(256, 256, `${initialSprite}`)        
    }

    playAnim(animId) {
        this.sprite.play(animId)
    }
}