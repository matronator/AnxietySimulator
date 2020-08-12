import Phaser from 'phaser'
import Level1 from './scenes/Level1'
import MenuScene from './scenes/MenuScene'
import Tutorial from './scenes/Tutorial'

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [MenuScene, Tutorial, Level1]
}

const game = new Phaser.Game(config)
