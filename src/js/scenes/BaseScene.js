import FocusBar from './../components/FocusBar'
import ProgressMeter from './../components/ProgressMeter'
import AnxietyBar from './../components/AnxietyBar'
import Clock from './../components/Clock'
import Talk from './../components/TalkAction'
import { CONVERSATIONS } from './../utils/Conversations'

class BaseScene extends Phaser.Scene {
    constructor(config) {
        super(config)
        this.fb
        this.accGainBase = 0.025
        this.velomaxBase = 1.75
        this.frictionBase = 0.96
        this.accGain = this.accGainBase
        this.velomax = this.velomaxBase
        this.friction = this.frictionBase
        this.acceleration = -0.002
        this.velocity = 0
        this.focus = 0
        this.constantVelo = 0
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
        this.deadlineAnx = 0

        this.keyQ
        this.keyE

        this.cteTimer
        this.cteTarget
        this.cteBar

        this.talkHud
        this.tteTimer
        this.tte
        this.tteSuccess
        this.currentTalk = 0
        this.conversationLabel
    }

    preload() {
        this.load.image('bar', 'src/images/bar.png')
        this.load.image('target', 'src/images/target.png')
        this.load.image('talk', 'src/images/talk.png')
        this.load.image('talk-warn', 'src/images/talk-danger.png')
    }

    create() {
        this.fb = new FocusBar(this, this.scale.width / 2, 100, 750, 58, 'bar')
        this.workBar = new ProgressMeter(this, this.fb.x - 300, this.fb.y - 50, 600, 16)
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

        this.talkHud = this.add.image(0, (this.scale.height / 2) - 163, 'talk').setOrigin(0, 0)
        this.conversationLabel = this.add.text(this.scale.width / 2, this.scale.height / 2, '', {
            align: 'center',
            wordWrap: {
                width: this.scale.width - 400
            },
            fontSize: 16
        }).setOrigin(0.5)
        this.conversationLabel.setVisible(0)
        this.tteTimer = this.time.addEvent({
            delay: 10000,
            callback: this.talkEventWarn,
            callbackScope: this,
            loop: false
        })
        // this.cteTimer = this.time.addEvent({
        //     delay: 1000,
        //     callback: this.clickTimeEvent,
        //     callbackScope: this,
        //     loop: false
        // })
    }

    talkEventWarn() {
        // this.currentTalk = Math.floor(Math.random() * (CONVERSATIONS.starters.length - 1))
        this.currentTalk = this.currentTalk < CONVERSATIONS.starters.length - 1 ? this.currentTalk + 1 : 0
        this.conversationLabel.setText(CONVERSATIONS.starters[this.currentTalk])
        this.conversationLabel.setVisible(1)
        this.talkHud.setTexture('talk-warn')
        this.time.delayedCall(3000, this.talkEvent, [], this)
    }

    talkEvent() {
        this.talkHud.setTexture('talk')
        this.tte = new Talk(this, this.talkHud.x, this.talkHud.y, 1, 3, 400)
    }

    talkingDone(anx, success) {
        if (anx > 0) {
            this.anxiety = this.anxBar.more(anx)
            this.conversationLabel.setText(CONVERSATIONS.answers.bad[this.currentTalk])
        } else if (anx < 0) {
            this.anxiety = this.anxBar.less(-anx)
            this.conversationLabel.setText(CONVERSATIONS.answers.good[this.currentTalk])
        } else {
            this.conversationLabel.setText(CONVERSATIONS.answers.neutral[this.currentTalk])
        }
        this.tteSuccess = this.add.text(this.talkHud.width, this.talkHud.y + 201, `${success}%`, { fontSize: 32, align: 'left' })
        this.time.delayedCall(4000, () => {
            this.tteSuccess.setVisible(0)
            this.conversationLabel.setVisible(0)
        }, [], this)

        this.tteTimer.remove(false)
        this.tteTimer = this.time.addEvent({
            delay: 10000,
            callback: this.talkEventWarn,
            callbackScope: this,
            loop: false
        })
    }

    // clickTimeEvent() {
    //     this.cteTarget = new Phaser.GameObjects.Image(this, 300 + (Math.random() * (this.scale.width - 600)), 200 + (Math.random() * (this.scale.height - 400)), 'target').setOrigin(0.5, 0.5)
    //     this.cteTarget.setInteractive()
    //     this.cteBar = new ProgressMeter(this, this.cteTarget.x - 50, this.cteTarget.y + (this.cteTarget.height / 2) + 20, 100, 10, true)
    //     this.cteBar.clearLabel()
    //     this.add.existing(this.cteTarget)
    //     this.cteTimer.remove(false)
    //     this.cteTimer = this.time.addEvent({
    //         delay: 500,
    //         callback: this.clickTimeDone,
    //         callbackScope: this,
    //         loop: false
    //     })
    // }

    // clickTimeDone() {
    //     this.cteTarget.setVisible(0)
    //     this.cteBar.remove()
    //     this.cteTimer.remove(false)
    //     this.cteTimer = this.time.addEvent({
    //         delay: 5000,
    //         callback: this.clickTimeEvent,
    //         callbackScope: this,
    //         loop: false
    //     })
    // }

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

    updateAnxiety() {
        if (this.clock.timeSince > 180) {
            this.deadlineAnx = 360
        }
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
            `Work delay: ${this.workTimer.timeScale.toFixed(3)}`,
            `Acceleration: ${this.acceleration.toFixed(4)}`,
            `Velocity: ${this.velocity.toFixed(4)}`,
            `VeloMax: ${this.velomax.toFixed(4)}`,
            `AccGain: ${this.accGain.toFixed(4)}`
        ]
        this.label.setAlpha(0.3)
        this.label.setText(this.devText)
    }
}

export default BaseScene
