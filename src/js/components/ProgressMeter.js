class ProgressMeter {
    constructor(scene, x, y, width, height, noText = false) {
        this.bar = new Phaser.GameObjects.Graphics(scene)

        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.value = 0
        this.p = (this.width - 4) / 100
        this.scene = scene
        this.noText = noText
        this.max = 100

        this.label
        this.text = 'Progress:'

        scene.add.existing(this.bar)

        if (!noText) {
            this.createLabel()
        }

        this.draw()
    }

    createLabel() {
        this.label = this.scene.add.text(this.x, this.y - this.height - 3, `${this.text} ${this.value}%`, { align: 'left' }).setOrigin(0, 0)
    }

    newMax(val) {
        this.p = (this.width - 4) / val
        this.value = val
        this.max = val
        this.draw()
    }

    less(amount) {
        this.value -= amount

        return this.updateValue()
    }

    clearLabel() {
        this.text = ``
        this.noText = true
        this.label = null
        this.draw()
    }

    more(amount) {
        this.value += amount

        return this.updateValue()
    }

    updateValue(val = null) {
        if (val !== null) {
            this.value = val
        }
        if (this.value > this.max) {
            this.value = this.max
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

        if (!this.noText) {
            this.label.text = `${this.text} ${Math.round(this.value)}%`
        }
    }

    remove() {
        this.bar.clear()
        return
    }
}

export default ProgressMeter
