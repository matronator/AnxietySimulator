/* eslint-disable spaced-comment */
import FocusBar from './../components/FocusBar'
import AnxietyBar from './../components/AnxietyBar'

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
/* - 11 - */`This is your Anxiety bar. It meassures your stress.`,
/* - 12 - */`The more stressed you are, the more your anxiety increases. As your anxiety increases, it will get more dificult to control your focus or react to tasks.`,
/* - 13 - */`By balancing your Focus bar in the middle, your anxiety will go down slowly. But have your productivity drop too low and your stress goes right back up.`,
/* - 14 - */`Now let's talk about social interactions.`,
/* - 15 - */`Throughout the day, people will come up to you for a quick chat.`,
/* - 16 - */`This is the part where you can let your productivity drop for a while to focus on the talk.`,
/* - 17 - */`An indicator will warn you when someone is there to talk to you.`,
/* - 18 - */`After they've opened up the dialog, you'll have to respond in a timely maner.`,
/* - 19 - */`You'll have to think about a proper response and form a coherent sentence. This is represented as a reaction mini-game.`,
/* - 20 - */`Several letters are going to appear one by one on the screen for a short time and you have to press the corresponding key on your keyboard, before the letter dissappears again.`,
/* - 21 - */`You form your answer by hitting the correct key on your keyboard, based on the letter shown on screen.`,
/* - 22 - */`If you hit the wrong key, or hit it too late, you break your train of thoughts and make a mistake in your response.`,
/* - 23 - */`Hit all the keys and you'll answer with a perfect response.`,
/* - 24 - */`But if you get all the letters wrong, you'll say the first thing that come to mind, without structure and making little sense.`,
/* - 25 - */`If you get the perfect answer, you'll gain confidence and your anxiety drops a bit.`,
/* - 26 - */`But speak some non-sense and you'll get embarassed and your anxiety will increase.`,
/* - 27 - */`Next up is coordination. When you have anxiety disorder, you watch your every step and are conscious about every little movement you make.`,
/* - 28 - */`Every move has to feel perfect, otherwise you'll start worrying about looking like an idiot, putting more stress on you making it more likely you'll actually look like an idiot...`,
/* - 29 - */`There will be moments, where someone asks you to hand them something or take something from them.`,
/* - 29 - */`When that happens, you'll have to make sure you execute your movements flawlessly.`
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

        this.anxBar
        this.anxiety = 10
        this.deadlineAnx = 0
    }

    preload() {
        this.load.image('bar', 'src/images/bar.png')
        this.load.image('bar-frame', 'src/images/bar-frame.png')
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
            this.fb = new FocusBar(this, this.scale.width / 2, 100, 750, 58)
        } else if (this.step === 4 || this.step === 7) {
            this.eLabel.setVisible(0)
            this.qLabel.setVisible(1)
        } else if (this.step === 5 || this.step === 8) {
            this.qLabel.setVisible(0)
            this.eLabel.setVisible(1)
        } else if (this.step === 6 || this.step === 9) {
            this.eLabel.setVisible(0)
        } else if (this.step === 10) {
            this.anxBar = new AnxietyBar(this, 4, 24, 100, 16)
            this.anxBar.updateValue(this.anxiety)
        }
    }

    update() {
        if (this.canContinue) {
            this.canContinueLabel.setText(`Press SPACE to continue`)
        } else {
            this.canContinueLabel.setText(``)
        }
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            if (this.canContinue && this.step < 28) {
                this.continue()
            } else if (this.step === 28) {
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
            this.canContinue = true
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
        } else if (this.step === 10) {
            this.canContinue = true
        } else if (this.step === 11) {
            if (this.anxiety < 100) {
                this.canContinue = false
                this.anxiety = this.anxBar.more(0.3)
                this.balanceFocus(this.anxiety, this.anxiety / 2)
                this.velocity += this.acceleration
                this.velocity *= 0.98
                if (this.velocity < -0.5 - (this.anxiety / 75)) {
                    this.velocity = -0.5 - (this.anxiety / 75)
                } else if (this.velocity > 0.5 + (this.anxiety / 75)) {
                    this.velocity = 0.5 + (this.anxiety / 75)
                }
                if (this.velocity >= 0) {
                    this.focus = this.fb.more(Math.abs(this.velocity))
                } else {
                    this.focus = this.fb.less(Math.abs(this.velocity))
                }
            } else {
                this.canContinue = true
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
