import ProgressMeter from './ProgressMeter'

class Word extends Phaser.GameObjects.GameObject {
    constructor(scene, x, y, key, talk, decay, trig) {
        super(scene, x, y, key)
        this.talk = talk
        this.x = x
        this.y = y
        this.decay = decay
        this.trigLbl = trig
        this.trig = scene.input.keyboard.addKey(trig)
        this.life = decay / 5
        this.gfx = new ProgressMeter(this.scene, this.x - 25, this.y + 32, 50, 10, true)
        this.gfx.newMax(this.life)
        this.lbl = this.scene.add.text(this.x, this.y, this.trigLbl, { align: 'center', fontSize: 32 }).setOrigin(0.5, 0.5)
        scene.add.existing(this)
    }

    destroy(fromScene) {
        if (!this.scene) {
            return
        }
        super.destroy(fromScene)
    }

    preUpdate(time, delta) {
        if (super.preUpdate) {
            super.preUpdate(time, delta)
        }
        this.life = this.gfx.less(1)
        if (this.life <= 0) {
            this.lbl.destroy()
            this.gfx.remove()
            this.destroy()
            return
        }
        if (this.trig.isDown) {
            this.lbl.destroy()
            this.gfx.remove()
            this.talk.talkSuccess(this.life)
            this.destroy()
            return
        }
    }
}

class Talk {
    constructor(scene, x, y, difficulty, count, speed) {
        this.scene = scene
        this.x = x
        this.y = y
        this.difficulty = difficulty
        this.count = count - 1
        this.speed = speed
        this.round = 0
        this.score = 0
        this.scoreMax = count * speed
        this.successHits = 0
        this.triggerKeys = ['A', 'S', 'D', 'F']
        this.letters = []

        this.conversationStart = [
            `Hey! What's up bro?`,
            `This project is going to be the end of me!`,
            `Everything okay? You seem a little twitchy today.`,
            `Hey man, how you doing today? All good?`,
            `Hi, how are you?`
        ]
        this.answerGood = [
            `Sup`,
            `Yeah, I know right? Ugh!`,
            `Yeah, just a little nervous before deadline. Thanks for asking!`,
            `So far so good. How about you?`,
            `Hi!`
        ]
        this.answerNeutral = [
            `Hey! Not much.`,
            `Is it really though?`,
            `Me? Sure, why wouldn't I be?`,
            `All good in the neighborhood!`,
            `Pretty good.`
        ]
        this.answerBad = [
            `What. What's up? Up where?`,
            `I also ended one time. Just end project. What? Uhm...`,
            `What? No! ME?? No way! You're twitchy!`,
            `Hi, yeah! Good weather, what about yours?`,
            `Hello, thanks, you too!`
        ]

        if (difficulty >= 2) {
            this.triggerKeys.push('J', 'K', 'L')
        }
        if (difficulty >= 3) {
            this.triggerKeys.push('X', 'C', 'V')
        }

        this.timer = scene.time.addEvent({
            delay: speed + 2000,
            callback: this.say,
            callbackScope: this,
            loop: false
        })
    }

    say() {
        const letter = this.shuffle(this.triggerKeys).pop()
        this.letters[letter] = new Word(this.scene, this.x + 67 + (67 * (this.round % 2)), this.y + (67 * (this.round + 1)), letter, this, this.speed, letter)
        this.round++
        this.timer.remove(false)
        if (this.round <= this.count) {
            this.timer = this.scene.time.addEvent({
                delay: this.speed * Math.abs(this.difficulty - 3),
                callback: this.say,
                callbackScope: this,
                loop: false
            })
        } else {
            this.timer = this.scene.time.addEvent({
                delay: this.speed * 2,
                callback: this.speak,
                callbackScope: this,
                loop: false
            })
        }
    }

    talkSuccess(val) {
        this.successHits++
        this.score += val
    }

    speak() {
        const finalScore = {
            hits: this.successHits,
            hitsMax: this.count + 1,
            score: this.score,
            scoreMax: this.scoreMax,
            speed: this.speed
        }
        const successRate = 100 / finalScore.hitsMax * finalScore.hits
        if (successRate > 70) {
            this.scene.talkingDone(-10, successRate)
        } else if (successRate > 50) {
            this.scene.talkingDone(0, successRate)
        } else {
            this.scene.talkingDone((50 - successRate) / 2, successRate)
        }
        return
    }

    // Fisher–Yates Shuffle taken from https://bost.ocks.org/mike/shuffle/
    shuffle(arr) {
        let m = arr.length
        let t
        let i
        while (m) {
            i = Math.floor(Math.random() * m--)
            t = arr[m]
            arr[m] = arr[i]
            arr[i] = t
        }
        return arr
    }
}

export default Talk
