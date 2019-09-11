import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import Player from "./sprites/Player";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

function loadAnimationSprites(ctx, sprite, name, frames_count) {
  let basepath = `assets/sprites/${sprite}/${name}`

  let animKey = `${sprite}_${name}`
  let animFrames = []

  for(let i=0; i < frames_count; ++i) {
    let filename = `${basepath}/${i}.png`

    let frameId = `${animKey}_${i}`

    ctx.load.spritesheet(frameId, filename, {frameWidth: 512, frameHeight: 512})

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
  this.load.image("logo", logoImg);

  loadAnimationSprites(this, "player", "idle", 11)
}

function create() {
  const player = new Player(this, 256, 256, "player_idle_0")
  player.playAnim("player_idle")
}
