class FocusBar {
    constructor(scene, x, y, width, height) {
        this.bar = new Phaser.GameObjects.Graphics(scene)

        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.value = 50
        this.p = (this.width - 4) / 100

        this.draw()

        scene.add.existing(this.bar)
    }

    less(amount) {
        this.value -= amount

        if (this.value < 0) {
            this.value = 0
        }

        this.draw()

        return (this.value === 0)
    }

    more(amount) {
        if (amount < 0) {
            return this.less(Math.abs(amount))
        }
        this.value += amount

        if (this.value > 100) {
            this.value = 0
        }

        this.draw()

        return (this.value === 0)
    }

    draw() {
        this.bar.clear()

        //  BG
        this.bar.fillStyle(0xffffff)
        this.bar.fillRect(this.x, this.y, this.width, this.height)

        const hue = (360 - (Math.abs(50 - this.value) - 68)) / 360

        this.bar.fillStyle(Phaser.Display.Color.HSLToColor(hue, 1, 0.5).color)

        const d = Math.floor(this.p * this.value)

        this.bar.fillRect(this.x + 2, this.y + 2, d, this.height - 4)
    }
}

export default FocusBar
