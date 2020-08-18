import Phaser from 'phaser'
import Level1 from './scenes/Level1'
import MenuScene from './scenes/MenuScene'
import Tutorial from './scenes/Tutorial'

const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1280,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    scene: [Tutorial, MenuScene, Level1]
}

const game = new Phaser.Game(config)
