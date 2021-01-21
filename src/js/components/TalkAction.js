import ProgressMeter from './ProgressMeter'
import Utils from './../utils/Utils'

// @flow
class Word extends Phaser.GameObjects.GameObject {
    constructor(scene, x: number, y: number, key: string, talk: Talk, decay: number, trig: string, missTrig: string[]) {
        super(scene, x, y, key)
        this.talk = talk
        this.x = x
        this.y = y
        this.decay = decay
        this.trigLbl = trig
        this.trig = scene.mainScene.input.keyboard.addKey(trig)
        this.missTrig = []
        missTrig.forEach(el => {
            this.missTrig.push(scene.mainScene.input.keyboard.addKey(el))
        })
        this.noMorePress = false
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
            this.talk.talkMiss()
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
        if (Utils.anyKeyDown(this.missTrig) && this.noMorePress === false) {
            this.noMorePress = true
            this.missTrig = []
            this.lbl.destroy()
            this.gfx.remove()
            this.talk.talkFail(this.life)
            this.destroy()
            return
        }
    }
}

class Talk {
    constructor(scene: Phaser.Scene, x: number, y: number, difficulty: number, count: number, speed: number) {
        this.scene = scene
        this.x = x
        this.y = y
        this.difficulty = difficulty
        this.count = count - 1
        this.speed = speed
        this.actualSpeed = this.speed * Math.abs(this.difficulty - 3)
        this.round = 0
        this.score = 0
        this.scoreMax = count * speed
        this.successHits = 0
        this.hitsTotal = 0
        this.hitsMax = count
        this.triggerKeys = ['T', 'F', 'G', 'H']
        this.letters = []

        if (difficulty >= 2) {
            this.triggerKeys.push('J', 'K', 'L')
        }
        if (difficulty >= 3) {
            this.triggerKeys.push('X', 'C', 'V')
        }

        this.timer = scene.time.addEvent({
            delay: speed,
            callback: this.say,
            callbackScope: this,
            loop: false
        })
    }

    say() {
        this.timer.remove(false)
        const allTriggers = Utils.shuffle(this.triggerKeys)
        const letter = allTriggers.pop()
        this.letters[letter] = new Word(this.scene, this.x + 67 + (67 * (this.round % 2)), this.y + (67 * (this.round + 1)), letter, this, this.speed, letter, allTriggers)
        this.round++
    }

    talkSuccess(val: number): void {
        this.successHits++
        this.hitsTotal++
        this.score += val
        if (this.hitsTotal === this.hitsMax) {
            this.timer.remove(false)
            this.speak()
        } else {
            this.timer.remove(false)
            this.timer = this.scene.time.addEvent({
                delay: val * 5,
                callback: this.say,
                callbackScope: this,
                loop: false
            })
        }
    }

    talkMiss(): void {
        this.hitsTotal++
        if (this.hitsTotal === this.hitsMax) {
            this.timer.remove(false)
            this.speak()
        } else {
            this.timer.remove(false)
            this.say()
        }
    }

    talkFail(val: number): void {
        this.scene.cameras.main.shake(100, 0.01)
        this.hitsTotal++
        if (this.hitsTotal === this.hitsMax) {
            this.timer.remove(false)
            this.speak()
        } else {
            this.timer.remove(false)
            this.timer = this.scene.time.addEvent({
                delay: val * 5,
                callback: this.say,
                callbackScope: this,
                loop: false
            })
        }
    }

    speak() {
        const finalScore = {
            hits: this.successHits,
            hitsMax: this.hitsMax,
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
}

export default Talk
