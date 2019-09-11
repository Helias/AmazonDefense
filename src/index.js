import Phaser from "phaser";
import Player from "./sprites/Player";
import Tree from "./sprites/Tree"; 

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 900,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

function loadAnimationSprites(ctx, sprite, name, frames_count) {
  let basepath = `assets/sprites/${sprite}/${name}`

  let animKey = `${sprite}_${name}`

  for(let i=0; i < frames_count; ++i) {
    let filename = `${basepath}/${i}.png`

    let frameId = `${animKey}_${i}`

    ctx.load.spritesheet(frameId, filename, {frameWidth: 512, frameHeight: 512})
  }
}

function registerAnimation(ctx, sprite, name, frames_count) {
  let basepath = `assets/sprites/${sprite}/${name}`

  let animKey = `${sprite}_${name}`
  let animFrames = []

  for(let i=0; i < frames_count; ++i) {
    let filename = `${basepath}/${i}.png`
    let frameId = `${animKey}_${i}`

    animFrames.push({ key: frameId })
  }

  ctx.anims.create({
    key: animKey,
    frames: animFrames,
    frameRate: 8,
    repeat: -1
  })
}

function preload() {
  loadAnimationSprites(this, "player", "idle", 11)
  loadAnimationSprites(this, "tree", "idle", 1)
}

function create() {
  registerAnimation(this, "player", "idle", 11)
  registerAnimation(this, "tree", "idle", 1)

  this.player = new Player(this, 256, 256, "player_idle_0")
  this.tree = new Tree(this, 10, 10, "tree_idle_0")

  this.player.playAnim('player_idle')
  this.tree.playAnim('tree_idle')
}

function update() {

}
