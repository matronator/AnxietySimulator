import Phaser from 'phaser'
import Level1 from './scenes/Level1'
import MenuScene from './scenes/MenuScene'

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [MenuScene, Level1]
}

const game = new Phaser.Game(config)
