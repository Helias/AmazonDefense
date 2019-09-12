import Phaser from "phaser";
import Player from "./sprites/Player";
import Tree from "./sprites/Tree"; 

import { coordinates } from './utils'
import { SETTINGS } from './settings'
import Enemy from "./sprites/Enemy";

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

function registerAnimation(ctx, sprite, name, frames_count, repeat=0, yoyo=false, frameRate=16) {
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
    frameRate: frameRate,
    repeat: repeat,
    yoyo: yoyo
  })
}

function preload() {
  loadAnimationSprites(this, "player", "idle", 11)
  loadAnimationSprites(this, "player", "walk", 17)
  loadAnimationSprites(this, "tree", "idle", 1)
  loadAnimationSprites(this, "enemy", "idle", 1)

  this.scene.scene.load.audio("background_song", "assets/audio/background_song.mp3")

  for(let i = 0; i < SETTINGS.hitSounds; ++i) {
    this.scene.scene.load.audio(`hit${i}`, `assets/audio/hit${i}.mp3`)
  }

  for(let i = 0; i < SETTINGS.lowhitSounds; ++i) {
    this.scene.scene.load.audio(`lowhit${i}`, `assets/audio/lowhit${i}.mp3`)
  }
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

function initEnemies(ctx, count, trees) {
  let enemies = []
  for(let i = 0; i <count; ++i){
    let minPos = coordinates(0.02, -0.2)
    let maxPos = coordinates(0.98, -0.2)

    let x = Math.random() * (maxPos.x - minPos.x) + minPos.x
    let y = Math.random() * (maxPos.y - minPos.y) + minPos.y

    // console.log(`Spawning enemy at ${x} ${y}`)

    let enemy = new Enemy(ctx, x, y, y, trees)
    enemy.playAnim('enemy_idle')

    enemies.push(enemy)
  }

  return enemies
}

function checkTrees(ctx) {
  for (let i = 0; i < ctx.trees.length; i++) {
    if (ctx.trees[i] != null && ctx.trees[i].hp <= 0 && !ctx.trees[i].isDead) {
      ctx.trees[i].isDead = true;
      ctx.trees[i].sprite.destroy();
      console.log(ctx.trees);
    }
  }
}

function create() {
  registerAnimation(this, "player", "idle", 11, -1, true)
  registerAnimation(this, "player", "walk", 17, -1, true, 32)
  registerAnimation(this, "tree", "idle", 1, -1, true)
  registerAnimation(this, "enemy", "idle", 1, -1, true)

  this.player = new Player(this, 256, 256)
  this.player.playAnim('player_idle')

  this.trees = []
  initTrees(this, 25)
  this.enemies = initEnemies(this, 4, this.trees)

  var backgroundMusic = this.scene.scene.sound.add("background_song", {
    mute: false,
    volume: 1,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0
  })

  // TODO: ENABLE IN RELEASE!
  backgroundMusic.play()
}

function update() {
  this.player.update(this)

  checkTrees(this)

  this.enemies.forEach((enemy) => {
      enemy.update(this, 0.98)
    }
  )

}
