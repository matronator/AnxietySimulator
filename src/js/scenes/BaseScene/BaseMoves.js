import ProgressMeter from './../../components/ProgressMeter'

class BaseMoves extends Phaser.Scene {
    constructor() {
        super({ key: 'BaseMoves' })
        this.mainSceneKey
        this.mainScene

        this.cteTimer
        this.cteTarget
        this.cteBar
    }

    init(data) {
        if (data) {
            this.mainSceneKey = data.key
            this.mainScene = this.scene.get(this.mainSceneKey)
        }
    }

    create() {
        this.cteTimer = this.time.addEvent({
            delay: 1000,
            callback: this.clickTimeEvent,
            callbackScope: this,
            loop: false
        })
    }

    clickTimeEvent() {
        this.cteTarget = new Phaser.GameObjects.Image(this, 300 + (Math.random() * (this.scale.width - 600)), 200 + (Math.random() * (this.scale.height - 400)), 'target').setOrigin(0.5, 0.5)
        this.cteTarget.setInteractive()
        this.cteBar = new ProgressMeter(this, this.cteTarget.x - 50, this.cteTarget.y + (this.cteTarget.height / 2) + 20, 100, 10, true)
        this.cteBar.clearLabel()
        this.add.existing(this.cteTarget)
        this.cteTimer.remove(false)
        this.cteTimer = this.time.addEvent({
            delay: 1500,
            callback: this.clickTimeDone,
            callbackScope: this,
            loop: false
        })
    }

    clickTimeDone() {
        this.cteTarget.setVisible(0)
        this.cteBar.remove()
        this.cteTimer.remove(false)
        this.cteTimer = this.time.addEvent({
            delay: 5000,
            callback: this.clickTimeEvent,
            callbackScope: this,
            loop: false
        })
    }
}

export default BaseMoves
