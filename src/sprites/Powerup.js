import { dist, coordinates } from "../utils";

export default class Powerup {
  constructor(ctx, x, y, depth) {
      this.sprite = ctx.add.sprite(x, y)
      this.sprite.depth = depth
      this.used = false
  }

  playAnim(animId) {
      this.sprite.play(animId);
  }

  activePowerup(player) {
    let distance = dist(this.sprite.x, this.sprite.y, player.sprite.x, player.sprite.y)
    if (!this.used && distance < 15) {
      if (this.state == 0) {
        player.maxSpeed = coordinates(0.01, 0.01)
      }
      else if (this.state == 1) {
        player.damage = 100
      }

      this.used = true
      this.sprite.destroy()

      setTimeout(() => {
        player.maxSpeed = coordinates(0.007, 0.007)
        player.damage = 50
        this.used = false
      }, 4000);

    }
  }

  update(player) {
    this.activePowerup(player)
  }

}
