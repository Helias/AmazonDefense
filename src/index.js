import Phaser from "phaser";
import Player from "./sprites/Player";
import Tree from "./sprites/Tree"; 

import { coordinates } from './utils'
import { SETTINGS } from './settings'

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: SETTINGS.canvasWidth,
  height: SETTINGS.canvasHeight,
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


function initTrees(ctx, count) {
  let minPos = coordinates(0.02, 0.7)
  let maxPos = coordinates(0.98, 0.9)

  for(let i=0; i<count; ++i) {
    let x = Math.random() * (maxPos.x - minPos.x) + minPos.x
    let y = Math.random() * (maxPos.y - minPos.y) + minPos.y

    let tree = new Tree(ctx, x, y, y)
    tree.playAnim('tree_idle')

    ctx.trees.push(tree)
  }
}

function create() {
  registerAnimation(this, "player", "idle", 11)
  registerAnimation(this, "tree", "idle", 1)

  this.player = new Player(this, 256, 256)
  this.player.playAnim('player_idle')

  this.trees = []
  this.enemies = []

  initTrees(this, 25)
}

function spawnEnemy() {

}

function update() {
  this.player.update(this)

  if(Math.random() > 0.9) {
    spawnEnemy()
  }
}
