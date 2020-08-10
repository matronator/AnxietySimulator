class ProgressBar {
    constructor(scene, x, y, width, height) {
        this.bar = new Phaser.GameObjects.Graphics(scene)

        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.value = 0
        this.p = (this.width - 4) / 100

        scene.add.existing(this.bar)
        this.label = scene.add.text(this.x, this.y + this.height + 3, `Progress: ${this.value}%`, { align: 'left' }).setOrigin(0, 0)

        this.draw()
    }

    less(amount) {
        this.value -= amount

        return this.updateValue()
    }

    more(amount) {
        this.value += amount

        return this.updateValue()
    }

    updateValue() {
        if (this.value > 100) {
            this.value = 100
        } else if (this.value < 0) {
            this.value = 0
        }
        this.draw()
        return this.value
    }

    draw() {
        this.bar.clear()

        //  BG
        this.bar.fillStyle(0xdedede)
        this.bar.fillRect(this.x, this.y, this.width, this.height)

        const hue = (360 - (this.value - 70)) / 360
        this.bar.fillStyle(Phaser.Display.Color.HSLToColor(hue, 1, 0.5).color)

        const d = Math.floor(this.p * this.value)
        this.bar.fillRect(this.x + 2, this.y + 2, d, this.height - 4)
        this.label.text = `Progress: ${Math.round(this.value)}%`
    }
}

export default ProgressBar
