import FocusBar from './../components/FocusBar'

class Tutorial extends Phaser.Scene {
    constructor() {
        super({ key: `Tutorial` })
        this.spacebar
        this.step = 0
        this.mainText
        this.strings = [
            `Hi there! Welcome to Anxiety Simulator!`,
            `The goal is to complete your assignment before the deadline.`,
            `This is your Focus bar. It indicates your concentration on the assignment.`,
            `You can control it by pressing 'Q' or 'E' on your keyboard.`,
            `By pressing 'Q' you decrease your focus.`,
            `Pressing 'E' will increase your focus`,
            `You should try to keep the indicator in the middle for maximum productivity.`,
            `Focus too little and you'll start procrastinating.`,
            `But focus too much and you'll get stuck over-analyzing the tiniest details.`,
            `By keeping the optimal level of concentration, you'll be most productive and work faster.`,
        ]
        this.qLabel
        this.eLabel
        this.qKey
        this.eKey

        this.fb
        this.acceleration = 0
        this.velocity = 0
        this.focus = 0
        this.direction = 0

        this.canContinue = true
        this.canContinueLabel
    }

    preload() {
        this.load.image('bar', 'src/images/bar.png')
    }

    create() {
        this.mainText = this.add.text(this.scale.width / 2, this.scale.height / 2, this.strings[this.step], { wordWrap: { width: this.scale.width - 100 }, fill: `white` }).setOrigin(0.5, 0.5)
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        this.canContinueLabel = this.add.text(this.scale.width / 2, this.scale.height - 30, `Press SPACE to continue`, { fontSize: 24, textAlign: 'center' }).setOrigin(0.5)
        this.qLabel = this.add.text((this.scale.width / 2) - 375, 200, `Q`, { fontSize: 64, textAlign: `center` }).setOrigin(0.5, 0)
        this.eLabel = this.add.text((this.scale.width / 2) + 375, 200, `E`, { fontSize: 64, textAlign: `center` }).setOrigin(0.5, 0)
        this.qLabel.setVisible(0)
        this.eLabel.setVisible(0)
    }

    continue() {
        this.step++
        this.mainText.setText(this.strings[this.step])
        if (this.step === 2) {
            this.fb = new FocusBar(this, this.scale.width / 2, 100, 750, 58, 'bar')
        } else if (this.step === 4 || this.step === 7) {
            this.eLabel.setVisible(0)
            this.qLabel.setVisible(1)
        } else if (this.step === 5 || this.step === 8) {
            this.qLabel.setVisible(0)
            this.eLabel.setVisible(1)
        } else if (this.step === 6 || this.step === 9) {
            this.eLabel.setVisible(0)
        }
    }

    update() {
        if (this.canContinue) {
            this.canContinueLabel.setText(`Press SPACE to continue`)
        } else {
            this.canContinueLabel.setText(``)
        }
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            if (this.canContinue && this.step < 9) {
                this.continue()
            } else if (this.step === 9) {
                this.scene.start(`Level1`)
            }
        }
        if (this.step === 4) {
            if (this.focus > -20) {
                this.canContinue = false
                this.focus = this.fb.less(0.2)
            } else {
                this.focus = -20
                this.fb.value = -20
                this.canContinue = true
            }
        } else if (this.step === 5) {
            if (this.focus < 20) {
                this.canContinue = false
                this.focus = this.fb.more(0.3)
            } else {
                this.focus = 20
                this.fb.value = 20
                this.canContinue = true
            }
        } else if (this.step === 6) {
            this.balanceFocus(0.2, 15)
            this.velocity += this.acceleration
            this.velocity *= 0.97
            if (this.velocity < -0.5) {
                this.velocity = -0.5
            } else if (this.velocity > 0.5) {
                this.velocity = 0.5
            }
            if (this.velocity >= 0) {
                this.focus = this.fb.more(Math.abs(this.velocity))
            } else {
                this.focus = this.fb.less(Math.abs(this.velocity))
            }
        } else if (this.step === 7) {
            if (this.focus > -50) {
                this.canContinue = false
                this.focus = this.fb.less(0.5)
            } else {
                this.focus = -50
                this.fb.value = -50
                this.canContinue = true
            }
        } else if (this.step === 8) {
            if (this.focus < 50) {
                this.canContinue = false
                this.focus = this.fb.more(1)
            } else {
                this.focus = 50
                this.fb.value = 50
                this.canContinue = true
            }
        } else if (this.step === 9) {
            this.balanceFocus(0.1, 5)
            this.velocity += this.acceleration
            this.velocity *= 0.97
            if (this.velocity < -0.5) {
                this.velocity = -0.5
            } else if (this.velocity > 0.5) {
                this.velocity = 0.5
            }
            if (this.velocity >= 0) {
                this.focus = this.fb.more(Math.abs(this.velocity))
            } else {
                this.focus = this.fb.less(Math.abs(this.velocity))
            }
        }
    }

    balanceFocus(accMax, fcMax) {
        if (this.direction === 0) {
            this.qLabel.setVisible(1)
            this.eLabel.setVisible(0)
            if (this.acceleration > -accMax) {
                this.acceleration -= accMax / 10
            } else {
                this.acceleration = -accMax
            }
            if (this.focus <= -fcMax) {
                this.direction = 1
            }
        } else {
            this.qLabel.setVisible(0)
            this.eLabel.setVisible(1)
            if (this.acceleration < accMax) {
                this.acceleration += accMax / 10
            } else {
                this.acceleration = accMax
            }
            if (this.focus >= fcMax) {
                this.direction = 0
            }
        }
    }
}

export default Tutorial
