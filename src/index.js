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
let myStorage = window.localStorage;

myStorage['data'] = myStorage['data'] ? myStorage['data'] : '{}';
myStorage['users'] = myStorage['users'] ? myStorage['users'] : '0';

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

  loadAnimationSprites(this, "player", "idle", 20)
  loadAnimationSprites(this, "player", "idleUp", 20)
  loadAnimationSprites(this, "player", "walk", 16)
  loadAnimationSprites(this, "player", "attack", 28)
  loadAnimationSprites(this, "player", "walkDown", 16)
  loadAnimationSprites(this, "player", "walkUp", 16)
  loadAnimationSprites(this, "tree", "idle", 7)
  loadAnimationSprites(this, "tree", "attack", 3)
  loadAnimationSprites(this, "tree", "fermo1", 1)
  loadAnimationSprites(this, "tree", "fermo2", 1)
  loadAnimationSprites(this, "tree", "fermo3", 1)
  loadAnimationSprites(this, "tree", "fermo4", 1)
  loadAnimationSprites(this, "tree", "idle", 18)
  loadAnimationSprites(this, "enemy", "walk", 17)
  loadAnimationSprites(this, "enemy", "attack", 17)
  loadAnimationSprites(this, "powerup-speed", "idle", 1)
  loadAnimationSprites(this, "powerup-strength", "idle", 1)
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
    tree.playAnim('tree_fermo1')

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
    enemy.playAnim('enemy_walk')

    enemies.push(enemy)
  }

  return enemies
}

function create() {
  registerAnimation(this, "player", "idle", 20, -1, true, 20)
  registerAnimation(this, "player", "idleUp", 20, -1, true, 20)
  registerAnimation(this, "player", "walk", 16, -1, true, 32)
  registerAnimation(this, "player", "walkDown", 16, -1, true, 32)
  registerAnimation(this, "player", "walkUp", 16, -1, true, 32)
  registerAnimation(this, "player", "attack", 28, -1, true, 60)
  
  registerAnimation(this, "tree", "idle", 18, -1, true,60)
  registerAnimation(this, "tree", "attack", 4, -1, true,5)
  registerAnimation(this, "tree", "fermo1", 1, -1, true)
  registerAnimation(this, "tree", "fermo2", 1, -1, true)
  registerAnimation(this, "tree", "fermo3", 1, -1, true)
  registerAnimation(this, "tree", "fermo4", 1, -1, true)
  registerAnimation(this, "tree", "idle", 18, -1, true,20)
  registerAnimation(this, "enemy", "walk", 17, -1, true,32)
  registerAnimation(this, "enemy", "attack", 17, -1, true,60)
  registerAnimation(this, "powerup-speed", "idle", 1, -1, true)
  registerAnimation(this, "powerup-strength", "idle", 1, -1, true)
  registerAnimation(this, "powerup-tree", "idle", 1, -1, true)

  this.add.image(0, 0, 'stage').setOrigin(0);

  this.player = new Player(this, 256, 256)
  this.player.playAnim('player_idle')

  this.powerup = null;

  setInterval(() => {
    if (this.powerup != null) {
      this.powerup.sprite.destroy()
    }

    let choose = Math.floor(Math.random() * 100) % 2;
    this.powerup = new Powerup(this, 30, 200, 20)
  
    if (choose == 0) {
      this.powerup.playAnim('powerup-speed_idle')
    }
    else if (choose == 1) {
      this.powerup.playAnim('powerup-strength_idle')
    } 
    this.powerup.state = choose
    this.powerup.used = false
  }, 20000);

  this.trees = []
  this.score = 0
  initTrees(this, 15)
  this.enemies = initEnemies(this, 8, this.trees)
  this.deadTrees = 0;

  this.scoreText = this.add.text(3, 3, 'score: '+this.score, {
    font: '20px Bangers',
    fill: '#fff'
  })

  this.backgroundMusic = this.scene.scene.sound.add("background_song", {
    mute: false,
    volume: 1,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0
  })

  // TODO: ENABLE IN RELEASE!
  // this.backgroundMusic.play()

  this.spawnDifficulty = 0.99
}

function storeUser(score) {
  let userJson = myStorage['data']; 
  userJson = JSON.parse(userJson);
  let i = parseInt(myStorage['users']); 
  userJson[i] = {
    'firstName' : document.getElementById("first_name").value, 
    'lastName' : document.getElementById("last_name").value,
    'score' : score,
  };
  myStorage['data'] = JSON.stringify(userJson);
  myStorage['users'] = (++i).toString(); 
}

function update() {
  gameEnabled = document.getElementById("player-init").value == 1;

  if (gameEnabled) {
    if(!this.backgroundMusic.isPlaying) {
      this.backgroundMusic.play()
    }

    this.player.update(this)
    this.enemies.forEach((enemy) => {
        enemy.update(this, this.spawnDifficulty)
      }
    )
    this.scoreText.setText("score: " + this.score);

    if(this.spawnDifficulty > 0.98)
      this.spawnDifficulty -= 0.00001

    console.log(this.spawnDifficulty)
  }
  else {
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].resetAttackPhase()
    }
  }

  if (this.deadTrees >= 15) {
    setTimeout(() => {
      let instance = M.Modal.getInstance(document.getElementsByClassName("modal")[0]);
      instance.destroy();
      setTimeout(() => { document.getElementById("checkgame").checked = true; }, 1000);
      setTimeout(() => { document.getElementById("arrow").className =  document.getElementById("arrow").className.replace("brown", ""); }, 1500);
    }, 500);
    storeUser(this.score);
    this.deadTrees = 0;
  }

  if (this.powerup != null) {
    this.powerup.update(this.player)
  }
}
