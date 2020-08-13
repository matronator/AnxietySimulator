class Clock {
    constructor(scene, x, y, fixed = false, time = { h: 9, m: 0 }, style = { align: 'right', fontSize: 32 }) {
        this.x = x
        this.y = y
        this.timeClock = time
        this.clockText = `${this.timeClock.h}:${this.timeClock.m <= 9 ? '0' : ''}${this.timeClock.m}`
        this.gameTime
        this.clock = scene.add.text(this.x, this.y, this.clockText, style).setOrigin(1, 0)
        this.height = this.clock.height
        this.width = this.clock.width
        if (!fixed) {
            this.gameTime = scene.time.addEvent({
                delay: 1000,
                callback: this.tick,
                callbackScope: this,
                loop: true
            })
        }
    }

    tick() {
        if (this.timeClock.m < 59) {
            this.timeClock.m++
        } else {
            this.timeClock.h++
            this.timeClock.m = 0
        }
        this.clockText = `${this.timeClock.h}:${this.timeClock.m <= 9 ? '0' : ''}${this.timeClock.m}`
        this.clock.setText(this.clockText)
    }
}

export default Clock
