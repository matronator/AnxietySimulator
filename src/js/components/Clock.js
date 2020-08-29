class Clock {
    constructor(scene, x, y, fixed = false, time = { h: 9, m: 0 }, style = { align: 'right', fontSize: 32 }) {
        this.x = x
        this.y = y
        this.scene = scene
        this.timeClock = time
        this.clockText = `${this.timeClock.h}:${this.timeClock.m <= 9 ? '0' : ''}${this.timeClock.m}`
        this.realTime = (time.h * 60) + time.m
        this.timeSince = 0
        this.gameTimer
        this.clock = scene.add.text(this.x, this.y, this.clockText, style).setOrigin(1, 0)
        this.height = this.clock.height
        this.width = this.clock.width
        if (!fixed) {
            this.gameTimer = scene.time.addEvent({
                delay: 1000,
                callback: this.tick,
                callbackScope: this,
                loop: true
            })
        }
    }

    tick() {
        this.realTime += 1
        this.timeSince += 1
        if (this.timeClock.m < 59) {
            this.timeClock.m++
        } else {
            this.timeClock.h++
            this.timeClock.m = 0
        }
        this.clockText = `${this.timeClock.h}:${this.timeClock.m <= 9 ? '0' : ''}${this.timeClock.m}`
        this.clock.setText(this.clockText)
        this.scene.updateAnxiety()
    }
}

export default Clock
