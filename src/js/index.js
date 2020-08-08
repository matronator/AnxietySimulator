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
let focus = 0
let momentum = 0
let label
let devText = [
    `Focus: ${focus}`,
    `Acceleration: ${acceleration}`,
    `Velocity: ${velocity}`,
    `Momentum: ${momentum}`
]

let keyQ
let keyE

function preload() {
    this.load.image('bar', 'src/images/bar.png')
}

function create() {
    fb = new FocusBar(this, game.scale.width / 2, 100, 750, 58, 'bar')
    fb.value = focus
    label = this.add.text(0, game.scale.height, devText, { align: 'left' }).setOrigin(0, 1)
    keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
    keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
}

function update() {
    if (keyQ.isDown) {
        if (acceleration < 0) {
            acceleration -= 0.005
        } else {
            momentum = acceleration
            acceleration = -0.02
        }
    } else if (keyE.isDown) {
        if (acceleration > 0) {
            acceleration += 0.005
        } else {
            momentum = acceleration
            acceleration = 0.02
        }
    }
    updateFocus()
}

function updateFocus() {
    if (acceleration < -0.4) {
        acceleration = -0.4
    } else if (acceleration > 0.4) {
        acceleration = 0.4
    }
    velocity += acceleration
    if (velocity < -2) {
        velocity = -2
    } else if (velocity > 2) {
        velocity = 2
    }
    if (velocity >= 0) {
        focus = fb.more(Math.abs(velocity))
    } else {
        focus = fb.less(Math.abs(velocity))
    }
    devText = [
        `Focus: ${focus.toFixed(4)}`,
        `Acceleration: ${acceleration.toFixed(4)}`,
        `Velocity: ${velocity.toFixed(4)}`,
        `Momentum: ${momentum.toFixed(4)}`
    ]
    label.setText(devText)
}
