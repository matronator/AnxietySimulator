import FocusBar from './../components/FocusBar'
import BaseUI from './BaseScene/BaseUI'
import BaseTalk from './BaseScene/BaseTalk'

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

        this.workProgress = 0
        this.workDelay = 175

        this.madnessGenerator
        this.madnessFreqBase = 1500
        this.madnessFreq = 200
        this.madnessVelo = 0

        this.deadline
        this.deadlineTime = { h: 15, m: 0 }
        this.deadlineTimeLeft = 360

        this.anxiety = 10
        this.deadlineAnx = 0
        this.anxTrigger = 50
        this.anxLock = false

        this.keyQ
        this.keyE

        this.cteTimer
        this.cteTarget
        this.cteBar

        this.ui
        this.talkScene

        this.shaking = {
            intensity: 0,
            offsetMax: 1,
            offsetX: 0,
            offsetY: 0,
            veloX: 0,
            veloY: 0
        }
        this.isShaking = false
        this.shakeTimer
    }

    preload() {
        this.load.image('bar', 'src/images/bar.png')
        this.load.image('target', 'src/images/target.png')
        this.load.image('talk', 'src/images/talk.png')
        this.load.image('talk-warn', 'src/images/talk-danger.png')
    }

    create() {
        this.fb = new FocusBar(this, this.scale.width / 2, 100, 750, 58, 'bar')
        this.fb.value = this.focus
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)

        // this.deadline = new Clock(this, this.scale.width, this.clock.height + 3, true, this.deadlineTime, { fontSize: 24, color: 'red' })

        // this.madnessGenerator = this.time.addEvent({
        //     delay: this.madnessFreq,
        //     callback: this.randomVelocity,
        //     callbackScope: this,
        //     loop: false
        // })
        // this.cteTimer = this.time.addEvent({
        //     delay: 1000,
        //     callback: this.clickTimeEvent,
        //     callbackScope: this,
        //     loop: false
        // })
        this.ui = this.scene.add(`BaseUI`, BaseUI, true, {
            key: this.scene.key
        })
        this.talkScene = this.scene.add(`BaseTalk`, BaseTalk, true, {
            key: this.scene.key
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
        this.velomax = Math.max(0.15, 2.1 - (Math.abs(this.focus * 2) / 50))
        this.velomax += this.anxiety / 150
        this.accGain = 0.015 - (Math.abs(this.focus * 2) / 10000)
        this.accGain += this.anxiety / 1500
        this.ui.workTimer.timeScale = this.fb.productivity / 100
        if (this.fb.productivity <= 10) {
            this.anxiety = this.ui.anxBar.more(this.deadlineAnx)
            this.anxLock = true
        } else if (this.fb.productivity > 85) {
            this.anxiety = this.ui.anxBar.less(0.02)
            this.anxLock = false
        } else {
            this.anxLock = false
        }
        this.shakeCam()
        if (this.anxiety > 50) {
            this.isShaking = true
        } else {
            this.isShaking = false
        }
        // this.cameras.main.shake(1000, 0.01)
    }

    shakeCam() {
        if (this.isShaking) {
            this.shaking.offsetMax = (this.anxiety - 50) / 8000
            // this.shaking.intensity = this.anxiety * 5
            this.shaking.intensity = 100
            this.shaking.offsetX = this.shaking.offsetX <= 0 ? Math.random() * this.shaking.offsetMax : Math.random() * -this.shaking.offsetMax
            this.shaking.offsetY = this.shaking.offsetY <= 0 ? Math.random() * this.shaking.offsetMax : Math.random() * -this.shaking.offsetMax
            this.cameras.main.shake(this.shaking.intensity, this.shaking.offsetMax)
            this.talkScene.cameras.main.shake(this.shaking.intensity, this.shaking.offsetMax)
            // this.cameras.main.setScroll(this.shaking.offsetX, this.shaking.offsetY)
            // this.talkScene.cameras.main.setScroll(this.shaking.offsetX, this.shaking.offsetY)
        } else {
            this.cameras.main.removeAllListeners()
            this.talkScene.cameras.main.removeAllListeners()
            // this.cameras.main.setScroll(0, 0)
            // this.talkScene.cameras.main.setScroll(0, 0)
        }
    }
}

export default BaseScene
