export default class Player {

    constructor(game, x, y, initialSprite) {
        this.sprite = game.add.sprite(120, 120, `${initialSprite}`)
    }

    playAnim(animId) {
        this.sprite.play(animId); 
    }

}