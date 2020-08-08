class FocusBar {
    constructor(scene, x, y, width, height, image) {
        this.bar = new Phaser.GameObjects.Graphics(scene)

        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.value = 0
        this.p = (this.width - 4) / 100

        this.draw()

        scene.add.existing(this.bar)
        scene.add.image(this.width / 2, this.y + (this.height / 2) + 5, 'bar')
    }

    less(amount) {
        this.value -= amount

        if (this.value < -50) {
            this.value = -50
        }

        this.draw()

        return (this.value === -50)
    }

    more(amount) {
        this.value += amount

        if (this.value > 50) {
            this.value = 50
        }

        this.draw()

        return (this.value === 50)
    }

    draw() {
        this.bar.clear()

        //  BG
        const hue = (360 - (Math.abs(this.value) - 68)) / 360
        this.bar.fillStyle(Phaser.Display.Color.HSLToColor(hue, 1, 0.5).color)

        this.bar.fillRect(this.x, this.y, this.width, this.height)

        this.bar.fillStyle(0xffffff)

        const d = Math.floor(this.p * (this.value + 50))
        this.bar.lineStyle(8, 0xffffff)
        this.bar.lineBetween(d, this.y, d, this.height + 10)

        // this.bar.fillRect(this.x + 2, this.y + 2, d, this.height - 4)
    }
}

export default FocusBar
