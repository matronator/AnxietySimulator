import FocusBar from './../components/FocusBar'
import ProgressBar from './../components/ProgressBar'

class BaseScene extends Phaser.Scene {
    constructor(config) {
        super(config)
        this.fb
        this.accGainBase = 0.05
        this.velomaxBase = 2
        this.frictionBase = 0.97
        this.accGain = this.accGainBase
        this.velomax = this.velomaxBase
        this.friction = this.frictionBase
        this.acceleration = 0
        this.velocity = 0
        this.focus = 0
        this.label
        this.devText = [
            `Focus: ${this.focus.toFixed(4)}`,
            `Acceleration: ${this.acceleration.toFixed(4)}`,
            `Velocity: ${this.velocity.toFixed(4)}`,
            `VeloMax: ${this.velomax.toFixed(4)}`,
            `AccGain: ${this.accGain.toFixed(4)}`
        ]

        this.workProgress = 0
        this.workBar
        this.workTimer
        this.workDelay = 175

        this.timeClock = {
            h: 9,
            m: 0
        }
        this.clock
        this.clockText = `${this.timeClock.h}:${this.timeClock.m <= 9 ? '0' : ''}${this.timeClock.m}`
        this.gameTime

        this.keyQ
        this.keyE
    }

    preload() {
        this.load.image('bar', 'src/images/bar.png')
    }

    create() {
        this.fb = new FocusBar(this, this.scale.width / 2, 100, 750, 58, 'bar')
        this.workBar = new ProgressBar(this, 4, 4, 200, 16)
        this.workBar.value = this.workProgress
        this.fb.value = this.focus
        this.label = this.add.text(0, this.scale.height, this.devText, { align: 'left' }).setOrigin(0, 1)
        this.clock = this.add.text(this.scale.width, 0, this.clockText, { align: 'right', fontSize: 32 }).setOrigin(1, 0)
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
        this.gameTime = this.time.addEvent({
            delay: 1000,
            callback: this.tick,
            callbackScope: this,
            loop: true
        })
        this.workTimer = this.time.addEvent({
            delay: this.workDelay,
            callback: this.workAdd,
            callbackScope: this,
            loop: true
        })
    }

    update() {
        if (this.keyQ.isDown) {
            if (this.acceleration < 0) {
                this.acceleration -= this.accGain
            } else {
                this.acceleration = -0.03
            }
        } else if (this.keyE.isDown) {
            if (this.acceleration > 0) {
                this.acceleration += this.accGain
            } else {
                this.acceleration = 0.03
            }
        }
        this.updateFocus()
        this.updateDevTools()
    }

    tick() {
        if (this.timeClock.m < 59) {
            this.timeClock.m++
        } else {
            this.timeClock.h++
            this.timeClock.m = 0
        }
        this.clockText = `${this.timeClock.h}:${this.timeClock.m <= 9 ? '0' : ''}${this.timeClock.m}`
        this.clock.setText(this.clockText)
    }

    workAdd() {
        this.workBar.more(0.1 + (0.1 / 100 * this.fb.productivity))
        this.workProgress = this.workBar.value
    }

    updateFocus() {
        if (this.acceleration < -0.4) {
            this.acceleration = -0.4
        } else if (this.acceleration > 0.4) {
            this.acceleration = 0.4
        }
        this.velocity += this.acceleration
        this.velocity *= this.friction
        if (this.velocity < -this.velomax) {
            this.velocity = -this.velomax
        } else if (this.velocity > this.velomax) {
            this.velocity = this.velomax
        }
        if (this.velocity >= 0) {
            this.focus = this.fb.more(Math.abs(this.velocity))
        } else {
            this.focus = this.fb.less(Math.abs(this.velocity))
        }
        this.velomax = 2 - (Math.abs(this.focus * 2) / 50)
        this.accGain = 0.015 - (Math.abs(this.focus * 2) / 10000)
        this.workTimer.timeScale = this.fb.productivity / 100
    }

    updateDevTools() {
        this.devText = [
            `Work: ${this.workProgress.toFixed(2)}%`,
            `Work delay: ${this.workTimer.timeScale.toFixed(3)}`,
            ``,
            `Focus: ${this.focus.toFixed(4)}`,
            `Acceleration: ${this.acceleration.toFixed(4)}`,
            `Velocity: ${this.velocity.toFixed(4)}`,
            `VeloMax: ${this.velomax.toFixed(4)}`,
            `AccGain: ${this.accGain.toFixed(4)}`
        ]
        this.label.setText(this.devText)
    }
}

export default BaseScene
