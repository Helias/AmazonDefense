export default class Tree {
    constructor(ctx, x, y, depth, initialSprite) {
        this.sprite = ctx.add.sprite(x, y, `${initialSprite}`)
        this.sprite.depth = depth

    }

    playAnim(animId) {
        this.sprite.play(animId); 
    }

}