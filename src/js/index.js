import Phaser from 'phaser'
import Level1 from './scenes/Level1'
import MenuScene from './scenes/MenuScene'
import Tutorial from './scenes/Tutorial'

window.devMode = false

const config = {
    type: Phaser.WEBGL,
    width: 1920,
    height: 1280,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    scene: [MenuScene, Tutorial, Level1]
}

const game = new Phaser.Game(config)
