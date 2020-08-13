class MenuScene extends Phaser.Scene {
    constructor() {
        super()
    }

    preload() {
        this.load.image(`logo`, `src/images/logo.png`)
        this.load.image(`play_btn`, `src/images/play_btn.png`)
    }

    create() {
        const logo = new Phaser.GameObjects.Image(this, this.scale.width / 2, 20, `logo`).setOrigin(0.5, 0)
        const playBtn = new Phaser.GameObjects.Image(this, this.scale.width / 2, this.scale.height / 2, `play_btn`).setInteractive({ cursor: 'pointer' })
        this.add.existing(logo)
        this.add.existing(playBtn)
        playBtn.on(`pointerdown`, () => {
            this.scene.start(`Level1`)
        })
        playBtn.on(`pointerover`, () => {
            playBtn.setTint(0xffff00)
        })
        playBtn.on(`pointerout`, () => {
            playBtn.clearTint()
        })
    }
}

export default MenuScene
