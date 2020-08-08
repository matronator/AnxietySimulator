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
let accGainBase = 0.05
let velomaxBase = 2
const frictionBase = 0.97
let accGain = accGainBase
let velomax = velomaxBase
let friction = frictionBase
let acceleration = 0
let velocity = 0
let focus = 0
let label
let devText = [
    `Focus: ${focus.toFixed(4)}`,
    `Acceleration: ${acceleration.toFixed(4)}`,
    `Velocity: ${velocity.toFixed(4)}`,
    `VeloMax: ${velomax.toFixed(4)}`,
    `AccGain: ${accGain.toFixed(4)}`
]

let time = {
    h: 9,
    m: 0
}
let clock
let clockText = `${time.h}:${time.m <= 9 ? '0' : ''}${time.m}`

let keyQ
let keyE

function preload() {
    this.load.image('bar', 'src/images/bar.png')
}

function create() {
    fb = new FocusBar(this, game.scale.width / 2, 100, 750, 58, 'bar')
    fb.value = focus
    label = this.add.text(0, game.scale.height, devText, { align: 'left' }).setOrigin(0, 1)
    clock = this.add.text(game.scale.width, 0, clockText, { align: 'right', fontSize: 32 }).setOrigin(1, 0)
    keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
    keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
}

function update() {
    if (keyQ.isDown) {
        if (acceleration < 0) {
            acceleration -= accGain
        } else {
            acceleration = -0.03
        }
    } else if (keyE.isDown) {
        if (acceleration > 0) {
            acceleration += accGain
        } else {
            acceleration = 0.03
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
    velocity *= friction
    if (velocity < -velomax) {
        velocity = -velomax
    } else if (velocity > velomax) {
        velocity = velomax
    }
    if (velocity >= 0) {
        focus = fb.more(Math.abs(velocity))
    } else {
        focus = fb.less(Math.abs(velocity))
    }
    velomax = 2 - (Math.abs(focus * 2) / 50)
    accGain = 0.015 - (Math.abs(focus * 2) / 10000)
    devText = [
        `Focus: ${focus.toFixed(4)}`,
        `Acceleration: ${acceleration.toFixed(4)}`,
        `Velocity: ${velocity.toFixed(4)}`,
        `VeloMax: ${velomax.toFixed(4)}`,
        `AccGain: ${accGain.toFixed(4)}`
    ]
    label.setText(devText)
}
