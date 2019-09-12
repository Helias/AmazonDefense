import Phaser from "phaser";
import Player from "./sprites/Player";
import Tree from "./sprites/Tree"; 
import Enemy from "./sprites/Enemy";
import Powerup from "./sprites/Powerup";

import { coordinates } from './utils'
import { SETTINGS } from './settings'

const config = {
  type: Phaser.AUTO,
  parent: "gameCanvas",
  width: SETTINGS.canvasWidth,
  height: SETTINGS.canvasHeight,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let gameEnabled = false;

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
  this.load.image("stage", "assets/stage.png") // background image

  loadAnimationSprites(this, "player", "idle", 11)
  loadAnimationSprites(this, "player", "walk", 17)
  loadAnimationSprites(this, "tree", "idle", 1)
  loadAnimationSprites(this, "enemy", "idle", 1)
  loadAnimationSprites(this, "powerup-tree", "idle", 1)

  this.scene.scene.load.audio("background_song", "assets/audio/background_song.mp3")
  this.cameras.main.backgroundColor.setTo(255,255,255); 

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
  for( let i = 0; i < count; ++i){
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

function spawnPowerup(ctx) {
  let powerup = new Powerup(ctx, 400, 400, 20)
  powerup.playAnim('powerup-tree_idle')
  return powerup
}

function create() {
  registerAnimation(this, "player", "idle", 11, -1, true, 10)
  registerAnimation(this, "player", "walk", 17, -1, true, 32)
  registerAnimation(this, "tree", "idle", 1, -1, true)
  registerAnimation(this, "enemy", "idle", 1, -1, true)
  registerAnimation(this, "powerup-tree", "idle", 1, -1, true)

  this.add.image(0, 0, 'stage').setOrigin(0);

  this.player = new Player(this, 256, 256)
  this.player.playAnim('player_idle')

  this.trees = []
  this.score = 0
  initTrees(this, 25)
  this.enemies = initEnemies(this, 4, this.trees)

  this.powerup = spawnPowerup(this)

  this.scoreText = this.add.text(3, 3, 'score: '+this.score, {
    font: '20px Bangers',
    fill: '#fff'
  })

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
  // backgroundMusic.play()
}

function update() {
  gameEnabled = document.getElementById("player-init").value == 1;
  if (gameEnabled) {
    this.player.update(this)
    this.enemies.forEach((enemy) => {
        enemy.update(this, 0.98)
      }
    )
    this.scoreText.setText("score: " + this.score);
    this.powerup.update(this.player)
  }
}
