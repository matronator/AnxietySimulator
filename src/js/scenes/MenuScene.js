import Modal from './../components/Modal'

class MenuScene extends Phaser.Scene {
    constructor() {
        super()
    }

    preload() {
        // Sprites
        this.load.image(`logo`, `src/images/logo.png`)
        this.load.image(`btn`, `src/images/button.png`)
        this.load.image(`btn_press`, `src/images/button-pressed.png`)
        this.load.image(`play_btn`, `src/images/play_btn.png`)
        this.load.image(`modal`, `src/images/modal.png`)
        // Audio
        this.load.audio(`menuMusic`, `src/audio/menu.mp3`)
    }

    create() {
        const music = this.sound.add(`menuMusic`, {
            volume: 0.8,
            loop: true,
            delay: 0
        })
        music.play()
        const logo = new Phaser.GameObjects.Image(this, this.scale.width / 2, 20, `logo`).setOrigin(0.5, 0)
        const playBtn = new Phaser.GameObjects.Image(this, this.scale.width / 2, this.scale.height / 2, `play_btn`).setInteractive({ cursor: 'pointer' })
        this.add.existing(logo)
        this.add.existing(playBtn)
        playBtn.on(`pointerdown`, () => {
            const tutorialPopup = new Modal(this, 'Do you want to play the tutorial or jump right into the game?', [
                { title: 'Tutorial', onClick: () => {
                    music.stop()
                    music.destroy()
                    this.scene.start(`Tutorial`)
                }, index: 0 },
                { title: 'Play Game', onClick: () => {
                    music.stop()
                    music.destroy()
                    this.scene.start(`Level1`)
                }, index: 1 }
            ])
            this.add.existing(tutorialPopup)
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
