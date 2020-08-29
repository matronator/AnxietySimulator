import AnxietyBar from './../../components/AnxietyBar'
import Clock from './../../components/Clock'
import ProgressMeter from './../../components/ProgressMeter'

class BaseUI extends Phaser.Scene {
    constructor() {
        super({
            key: 'BaseUI'
        })
        this.mainSceneKey
        this.mainScene

        this.clock
        this.anxBar
        this.workBar
        this.label
        this.devText
    }

    init(data) {
        if (data) {
            this.mainSceneKey = data.key
            this.mainScene = this.scene.get(this.mainSceneKey)
        }
    }

    create() {
        this.devText = [
            `Focus: ${this.mainScene.focus.toFixed(4)}`,
            `Acceleration: ${this.mainScene.acceleration.toFixed(4)}`,
            `Velocity: ${this.mainScene.velocity.toFixed(4)}`,
            `VeloMax: ${this.mainScene.velomax.toFixed(4)}`,
            `AccGain: ${this.mainScene.accGain.toFixed(4)}`
        ]
        this.clock = new Clock(this, this.scale.width, 0)
        this.label = this.add.text(0, this.scale.height, this.devText, { align: 'left' }).setOrigin(0, 1)
        this.anxBar = new AnxietyBar(this, 4, 24, 100, 16)
        this.workBar = new ProgressMeter(this, this.mainScene.fb.x - 300, this.mainScene.fb.y - 50, 600, 16)
        this.workBar.value = this.mainScene.workProgress
        this.anxBar.updateValue(this.mainScene.anxiety)
        this.workTimer = this.time.addEvent({
            delay: this.mainScene.workDelay,
            callback: this.workAdd,
            callbackScope: this,
            loop: true
        })
    }

    update() {
        this.updateDevTools()
    }

    updateAnxiety() {
        const timeWorkRatio = Math.round((this.mainScene.workProgress / 100) * 360)
        this.mainScene.anxTrigger = 50 + ((this.clock.timeSince - timeWorkRatio) / 360 * 50)
        const anxGain = Math.max(this.clock.timeSince - timeWorkRatio, 0) / 360
        this.mainScene.deadlineAnx = Math.pow(this.clock.timeSince, anxGain) / 10
        if (!this.mainScene.anxLock && this.mainScene.fb.productivity <= this.mainScene.anxTrigger) {
            this.mainScene.anxiety = this.anxBar.more(this.mainScene.deadlineAnx * 10)
        }
    }

    workAdd() {
        this.mainScene.workProgress = this.workBar.more(0.1 + (0.1 / 100 * this.mainScene.fb.productivity))
    }

    updateDevTools() {
        this.devText = [
            `Time  Since: ${this.clock.timeSince}`,
            `WorkPrgress: ${this.mainScene.workProgress}`,
            `Anx Trigger: ${this.mainScene.anxTrigger.toFixed(4)}`,
            `DeadlineAnx: ${this.mainScene.deadlineAnx.toFixed(4)}`,
            `AnxietyGain: ${this.mainScene.fb.productivity <= this.mainScene.anxTrigger ? 'true' : 'false'}`
        ]
        this.label.setAlpha(1)
        this.label.setText(this.devText)
    }
}

export default BaseUI
