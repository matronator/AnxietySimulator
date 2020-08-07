import Phaser from 'phaser'
import FocusBar from './components/FocusBar'

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload,
        create,
        update
    }
}

const game = new Phaser.Game(config)
let fb
let momentum = 0.1

function preload() {
}

function create() {
    fb = new FocusBar(this, 0, 100, game.scale.width, 20)
}

function update() {
    fb.more(momentum)
}
