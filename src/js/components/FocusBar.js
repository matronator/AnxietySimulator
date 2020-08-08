class FocusBar {
    constructor(scene, x, y, width, height, image) {
        this.bar = new Phaser.GameObjects.Graphics(scene)

        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.value = 0
        this.productivity = 100
        this.p = (this.width - 4) / 100
        this.p2 = (this.width - 4) / -50

        scene.add.existing(this.bar)
        scene.add.image(this.x, this.y + (this.height / 2) + 5, image)
        this.label = scene.add.text(this.x, this.y + this.height + 32, `Productivity: ${this.productivity}`, { align: 'center' }).setOrigin(0.5)

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
        if (this.value > 50) {
            this.value = 50
        } else if (this.value < -50) {
            this.value = -50
        }
        this.productivity = (50 - Math.abs(this.value)) * 2
        this.draw()
        return this.value
    }

    draw() {
        this.bar.clear()

        //  BG
        this.bar.fillStyle(0xdedede)
        this.bar.fillRect(this.x - (this.width / 2), this.y, this.width, this.height)

        const hue = (360 - (Math.abs(this.value) - 70)) / 360
        this.bar.fillStyle(Phaser.Display.Color.HSLToColor(hue, 1, 0.5).color)

        const d = Math.floor(this.p * (this.value + 50))
        const d2 = Math.floor(this.p2 * this.value)
        // this.bar.fillRect(this.x + 2, this.y + 2, d, this.height - 4)
        this.bar.fillRect(this.x - (d2 / 2), this.y + 2, d2 / 2, this.height - 4)

        this.bar.lineStyle(7, 0xbbbbbb)
        this.bar.lineBetween(this.x - (d2 / 2), this.y - 24, this.x - (d2 / 2), this.y + this.height + 24)
        this.bar.lineStyle(1, 0xdd0000)
        this.bar.lineBetween(this.x - (d2 / 2), this.y - 12, this.x - (d2 / 2), this.y + this.height + 12)
        this.label.text = `Productivity: ${this.productivity.toFixed(3)}`
    }
}

export default FocusBar
