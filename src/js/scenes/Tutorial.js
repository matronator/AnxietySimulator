/* eslint-disable spaced-comment */
import FocusBar from './../components/FocusBar'

class Tutorial extends Phaser.Scene {
    constructor() {
        super({ key: `Tutorial` })
        this.spacebar
        this.step = 0
        this.mainText
        /* eslint-disable indent */
        this.strings = [
/* - 01 - */`Hi there! Welcome to Anxiety Simulator!`,
/* - 02 - */`The goal is to complete your assignment before the deadline.`,
/* - 03 - */`This is your Focus bar. It indicates your concentration on the assignment.`,
/* - 04 - */`You can control it by pressing 'Q' or 'E' on your keyboard.`,
/* - 05 - */`By pressing 'Q' you decrease your focus.`,
/* - 06 - */`Pressing 'E' will increase your focus`,
/* - 07 - */`You should try to keep the indicator in the middle for maximum productivity.`,
/* - 08 - */`Focus too little and you'll start procrastinating.`,
/* - 09 - */`But focus too much and you'll get stuck over-analyzing the tiniest details.`,
/* - 10 - */`By keeping the optimal level of concentration, you'll be most productive and work faster.`,
/* - 11 - */`This is your Anxiety meter. Your anxiety levels are based on stress.`,
/* - 12 - */`The more stressed you are, the more your anxiety increases. And the more anxiety you feel, the more your stress increases.`,
/* - 13 - */`It's a vicious circle, I tell you, anxiety is no joke... Anyways, so better keep that anxiety and stress down.`,
/* - 14 - */`By balancing your Focus bar in the middle, your anxiety will go down slowly. But have your productivity drop too low and your stress goes right back up.`,
/* - 15 - */`But just balancing your focus to work would be too easy and that's not how it is in real life.`,
/* - 16 - */`Throughout the day, you will have to face the most powerful enemy someone with social anxiety can have.`,
/* - 17 - */`Social interactions! Dun dun duuuun...`,
/* - 18 - */`Occasionally, people will come up to you for a quick chat. This is the part where you can let your productivity drop for a while to focus on the talk.`,
/* - 19 - */`An indicator will warn you when someone is there to talk to you.`,
/* - 20 - */`After they've opened up the dialog, you'll have to respond in a timely maner.`,
/* - 21 - */`Several letters are going to appear one by one on the screen for a short time and you have to press the corresponding key on your keyboard, before the letter dissappear again.`,
/* - 22 - */`If you press either the correct key or a wrong one, the letter will dissapear and another letter will appear shortly, depending on the time left on the previous letter.`,
/* - 23 - */`If the time runs out on the current letter, it will dissapear and another one will appear immediately after.`,
/* - 24 - */`You get points only for the letters that you hit the correct key on.`,
/* - 25 - */`Think of the letters as you comming up with a response to say.`,
/* - 26 - */`After a series of 3-5 letters, depending on how many letters you hit correctly, you will respond.`,
/* - 27 - */`If you hit all the letters, your response will be well formed and appropriate and your anxiety levels drop down a bit.`,
/* - 28 - */`The less letters you hit, the worse your response will be.`,
/* - 29 - */`If you miss all the letters or hit all the wrong keys, your response will either be a word salad that makes little sense, or very inapropriate.`,
/* - 30 - */`If that happens, you'll get embarassed, which causes you to stress about it, which increases your anxiety and Bob's your uncle.`
        ]
        /* eslint-enable indent */
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
