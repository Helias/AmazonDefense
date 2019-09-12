export default class Tree {
    constructor(ctx, x, y, depth) {
        this.sprite = ctx.add.sprite(x, y)
        this.sprite.depth = depth
    }

    playAnim(animId) {
        this.sprite.play(animId); 
    }

}