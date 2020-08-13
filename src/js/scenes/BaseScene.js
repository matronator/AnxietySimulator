import FocusBar from './../components/FocusBar'
import ProgressMeter from './../components/ProgressMeter'
import AnxietyBar from './../components/AnxietyBar'
import Clock from './../components/Clock'

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
        this.acceleration = -0.002
        this.velocity = 0
        this.focus = 0
        this.constantVelo = -0.02
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

        this.madnessGenerator
        this.madnessFreqBase = 1500
        this.madnessFreq = 200
        this.madnessVelo = 0

        this.clock
        this.deadline
        this.deadlineTime = { h: 15, m: 0 }

        this.anxBar
        this.anxiety = 10

        this.keyQ
        this.keyE
    }

    preload() {
        this.load.image('bar', 'src/images/bar.png')
    }

    create() {
        this.fb = new FocusBar(this, this.scale.width / 2, 100, 750, 58, 'bar')
        this.workBar = new ProgressMeter(this, this.scale.width - 204, this.scale.height - 20, 200, 16)
        this.workBar.value = this.workProgress
        this.fb.value = this.focus
        this.label = this.add.text(0, this.scale.height, this.devText, { align: 'left' }).setOrigin(0, 1)
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)

        this.clock = new Clock(this, this.scale.width, 0)
        // this.deadline = new Clock(this, this.scale.width, this.clock.height + 3, true, this.deadlineTime, { fontSize: 24, color: 'red' })

        // this.madnessGenerator = this.time.addEvent({
        //     delay: this.madnessFreq,
        //     callback: this.randomVelocity,
        //     callbackScope: this,
        //     loop: false
        // })
        this.workTimer = this.time.addEvent({
            delay: this.workDelay,
            callback: this.workAdd,
            callbackScope: this,
            loop: true
        })
        this.anxBar = new AnxietyBar(this, 4, 24, 100, 16)
        this.anxBar.updateValue(this.anxiety)
    }

    update() {
        // if (this.constantVelo < 0) {
        //     this.fb.less(Math.abs(this.constantVelo))
        // } else if (this.constantVelo > 0) {
        //     this.fb.more(this.constantVelo)
        // }
        this.checkInputs()
        this.updateFocus()
        this.updateDevTools()
    }

    checkInputs() {
        if (this.keyQ.isDown) {
            // this.constantVelo = 0
            if (this.acceleration < 0) {
                this.acceleration -= this.accGain
            } else {
                this.acceleration = -0.03
            }
        } else if (this.keyE.isDown) {
            // this.constantVelo = 0
            if (this.acceleration > 0) {
                this.acceleration += this.accGain
            } else {
                this.acceleration = 0.03
            }
        }
    }

    workAdd() {
        this.workBar.more(0.1 + (0.1 / 100 * this.fb.productivity))
        this.workProgress = this.workBar.value
    }

    // randomVelocity() {
    //     this.madnessFreq = this.madnessFreqBase
    //     if (this.fb.productivity >= 70 && Math.random() >= 0.75) {
    //         if (Math.abs(this.velocity) <= 0.4) {
    //             this.velocity = this.velocity > 0 ? -0.5 : 0.5
    //         } else if (Math.abs(this.velocity) <= 0.8) {
    //             this.velocity = this.velocity > 0 ? -0.3 : 0.3
    //         }
    //     }
    //     this.madnessGenerator = this.time.addEvent({
    //         delay: this.madnessFreq,
    //         callback: this.randomVelocity,
    //         callbackScope: this,
    //         loop: false
    //     })
    // }

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
        if (this.fb.productivity < 20) {
            this.productivityLow()
        } else if (this.fb.productivity > 75) {
            this.anxiety = this.anxBar.less(0.02)
        }
        this.velomax = Math.max(0.15, 2.1 - (Math.abs(this.focus * 2) / 50))
        this.accGain = 0.015 - (Math.abs(this.focus * 2) / 10000)
        this.workTimer.timeScale = this.fb.productivity / 100
    }

    productivityLow() {
        if (this.focus < 0) {
            this.anxiety = this.anxBar.more(this.focus / -1000)
            // procrastinating
        } else {
            this.anxiety = this.anxBar.more(this.focus / 1000)
            // over-analyzing
        }
    }

    updateDevTools() {
        this.devText = [
            `Work: ${this.workProgress.toFixed(2)}%`,
            `Work delay: ${this.workTimer.timeScale.toFixed(3)}`,
            ``,
            `Constant: ${this.constantVelo.toFixed(3)}`,
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
