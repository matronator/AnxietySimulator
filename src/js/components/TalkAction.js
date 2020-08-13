class Word extends Phaser.GameObjects.Graphics {
    constructor(scene, talk, x, y, decay, trig) {
        super(scene)
        this.talk = talk
        this.x = x
        this.y = y
        this.decay = decay
        this.trigLbl = trig
        this.trig = scene.input.keyboard.addKey(trig)
        this.life = decay
        this.lbl = new Phaser.GameObjects.Text(scene, x, y, trig, { align: 'center', fontSize: '32' })
        scene.add.existing(this.lbl)
        scene.add.existing(this)
        this.draw()
    }

    update() {
        if (this.trig.isDown) {
            this.talk.talkSuccess(this.life)
            this.destroy()
        }
        this.life -= 0.1
        if (this.life <= 0) {
            this.talk.talkSuccess(this.life)
            this.destroy()
        }
        this.draw()
    }

    draw() {
        const hue = (360 - (this.life - 20)) / 360
        this.fillStyle(Phaser.Display.Color.HSLToColor(hue, 1, 0.5).color)

        const d = Math.floor(this.width / 100 * this.life)
        this.fillRect(this.x, this.y + this.height, d, 12)
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
        if (difficulty >= 2) {
            this.triggerKeys.push('J', 'K', 'L')
        }
        if (difficulty >= 3) {
            this.triggerKeys.push('X', 'C', 'V')
        }

        this.timer = scene.time.addEvent({
            delay: speed + 250,
            callback: this.say,
            callbackScope: this,
            repeat: this.count
        })
    }

    say() {
        this.round++
        const letter = this.shuffle(this.triggerKeys).pop()
        const sayIt = new Word(this.scene, this, this.x, this.y, this.speed, letter)
        this.scene.add.existing(sayIt)
    }

    talkSuccess(val) {
        this.successHits++
        this.score += val
        if (this.round >= this.count) {
            this.timer.remove()
        }
    }

    talkFailed() {
        if (this.round >= this.count) {
            this.timer.remove()
        }
    }

    speak() {
        const finalScore = {
            hits: this.successHits,
            hitsMax: this.count,
            score: this.score,
            scoreMax: this.scoreMax,
            speed: this.speed
        }
        return finalScore
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
