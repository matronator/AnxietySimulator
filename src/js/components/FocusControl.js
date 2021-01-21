import FocusBar from './FocusBar'

// @flow
class FocusControl extends Phaser.GameObjects.Image {
    constructor(scene: Phaser.Scene, x: number, y: number, key = 'bar', options = {
        accGainBase: 0.025,
        velomaxBase: 1.75,
        frictionBase: 0.96,
        keyMore: 'E',
        keyLess: 'Q'
    }) {
        super(scene, x, y, key)
        this.scene = scene
        this.accGainBase = options.accGainBase
        this.velomaxBase = options.velomaxBase
        this.frictionBase = options.frictionBase
        this.accGain = this.accGainBase
        this.velomax = this.velomaxBase
        this.friction = this.frictionBase
        this.acceleration = -0.002
        this.velocity = 0
        this.focus = 0
        this.constantVelo = 0

        this.fb = new FocusBar(this.scene, x, y, 750, 58)
        this.fb.value = this.focus

        this.keyLess = this.scene.input.keyboard.addKey(options.keyLess)
        this.keyMore = this.scene.input.keyboard.addKey(options.keyMore)
        this.setAlpha(0)
        scene.add.existing(this)
    }

    preUpdate(time, delta) {
        if (super.preUpdate) {
            super.preUpdate(time, delta)
        }
        this.checkInputs()
        this.updateFocus()
    }

    checkInputs() {
        if (this.keyLess.isDown) {
            // this.constantVelo = 0
            if (this.acceleration < 0) {
                this.acceleration -= this.accGain
            } else {
                this.acceleration = -0.03
            }
        } else if (this.keyMore.isDown) {
            // this.constantVelo = 0
            if (this.acceleration > 0) {
                this.acceleration += this.accGain
            } else {
                this.acceleration = 0.03
            }
        }
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
        this.velomax = Math.max(0.15, 2.1 - (Math.abs(this.focus * 2) / 50))
        this.velomax += this.scene.anxiety / 150
        this.accGain = 0.015 - (Math.abs(this.focus * 2) / 10000)
        this.accGain += this.scene.anxiety / 1500
        this.scene.ui.workTimer.timeScale = this.fb.productivity / 100
        if (this.fb.productivity <= 10) {
            this.scene.anxiety = this.scene.ui.anxBar.more(this.scene.deadlineAnx)
            this.scene.anxLock = true
        } else if (this.fb.productivity > 85) {
            this.scene.anxiety = this.scene.ui.anxBar.less(0.02)
            this.scene.anxLock = false
        } else {
            this.scene.anxLock = false
        }
    }
}

export default FocusControl
