import BaseUI from './BaseScene/BaseUI'
import BaseTalk from './BaseScene/BaseTalk'
import BaseMoves from './BaseScene/BaseMoves'
import FocusControl from './../components/FocusControl'
import MenuScene from './MenuScene'
import Modal from '../components/Modal'

class BaseScene extends Phaser.Scene {
    constructor(config) {
        super(config)
        this.fb

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

        this.ui
        this.talkScene
        this.moveScene

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
        this.dead = false
        this.cheat
    }

    preload() {
        this.load.image('bar', 'src/images/bar.png')
        this.load.image('bar-frame', 'src/images/bar-frame.png')
        this.load.image('target', 'src/images/target.png')
        this.load.image('talk', 'src/images/talk.png')
        this.load.image('talk-warn', 'src/images/talk-danger.png')
    }

    create() {
        this.fb = new FocusControl(this, this.scale.width / 2, 100, 'bar')
        this.cheat = this.input.keyboard.addKey('Y')
        // this.deadline = new Clock(this, this.scale.width, this.clock.height + 3, true, this.deadlineTime, { fontSize: 24, color: 'red' })

        // this.madnessGenerator = this.time.addEvent({
        //     delay: this.madnessFreq,
        //     callback: this.randomVelocity,
        //     callbackScope: this,
        //     loop: false
        // })
        this.ui = this.scene.add(`BaseUI`, BaseUI, true, {
            key: this.scene.key
        })
        this.talkScene = this.scene.add(`BaseTalk`, BaseTalk, true, {
            key: this.scene.key
        })
        // this.moveScene = this.scene.add(`BaseMoves`, BaseMoves, true, {
        //     key: this.scene.key
        // })
    }

    update() {
        // if (this.constantVelo < 0) {
        //     this.fb.less(Math.abs(this.constantVelo))
        // } else if (this.constantVelo > 0) {
        //     this.fb.more(this.constantVelo)
        // }
        if (this.cheat.isDown) {
            // this.constantVelo = 0
            this.anxiety -= 0.1
        }
        if (this.anxiety < 100) {
            this.updateFocus()
        } else {
            if (!this.dead) {
                this.dead = true
                this.isShaking = false
                // this.ui.scene.stop()
                // this.talkScene.scene.stop()
                const gameOverPopup = new Modal(this, `You've had a panic breakdown and they had to take you to the psych ward. AKA Game Over!`, [
                    { title: 'Play again', onClick: () => {
                    //     this.scene.remove(`BaseTalk`)
                    //     this.scene.remove(`BaseUI`)
                    //     this.scene.remove(`BaseScene`)
                        this.scene.restart()
                    }, index: 0 },
                    { title: 'Main game', onClick: () => {
                        // this.scene.remove(`BaseTalk`)
                        // this.scene.remove(`BaseUI`)
                        this.game.scene.destroy()
                        window.location.reload()
                    }, index: 1 }
                ])
                this.add.existing(gameOverPopup)
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
