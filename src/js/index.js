import Phaser from 'phaser'
import FocusBar from './components/FocusBar'

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: {
        preload,
        create,
        update
    }
}

const game = new Phaser.Game(config)
let fb
let acceleration = 0
let velocity = 0
let drag = 0.87
let focus = 0

let keyQ
let keyE

function preload() {
    this.load.image('bar', 'src/images/bar.png')
}

function create() {
    fb = new FocusBar(this, 0, 100, game.scale.width, 58, 'bar')
    fb.value = focus
    keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
    keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
}

function update() {
    if (keyQ.isDown) {
        acceleration -= 0.02
    } else if (keyE.isDown) {
        acceleration += 0.02
    }
    updateFocus()
}

let momentum = 0

function updateFocus() {
    if (acceleration < -0.5) {
        acceleration = -0.5
    } else if (acceleration > 0.4) {
        acceleration = 0.4
    }
    velocity += acceleration
    velocity *= drag
    if (velocity < -2) {
        velocity = -2
    } else if (velocity > 2) {
        velocity = 2
    }
    if (focus < 0) {
        momentum = velocity + (-0.5 + Math.abs(focus / 50))
    } else {
        momentum = velocity + (0.5 - (focus / 50))
    }
    if (velocity >= 0) {
        focus = fb.more(Math.abs(velocity))
    } else {
        focus = fb.less(Math.abs(velocity))
    }
}
