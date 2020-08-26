import Phaser from 'phaser'

// @flow

type ModalButton = {
    title: string,
    index?: number,
    onClick: void,
    obj?: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    hitArea: Phaser.Geom.Rectangle,
    label: Phaser.GameObjects.Text
}

class Modal {
    constructor(scene: Phaser.Scene, message: string, buttons: ModalButton[]) {
        this.message = message
        this.scene = scene
        this.img = scene.add.image(scene.scale.width / 2, scene.scale.height / 2, 'modal').setOrigin(0.5)
        this.dialog = scene.add.text(this.img.x, this.img.y - 120, message, {
            wordWrap: { width: this.img.width - 50 },
            align: 'center',
            fontSize: 21,
            color: `#222222`
        }).setOrigin(0.5)
        this.dialog.setDepth(11)
        this.img.setDepth(10)
        let i = 0
        buttons.forEach(btn => {
            if (!btn.index) {
                btn.index = i
            }
            if (!btn.title) {
                btn.title = 'Ok'
            }
            btn.x = scene.scale.width / 2
            btn.y = this.img.y + (this.img.height / 2) - ((buttons.length - btn.index) * 40)
            btn.label = scene.add.text(btn.x, btn.y, btn.title, {
                align: 'center',
                fontSize: 16,
                color: `black`
            }).setOrigin(0.5)
            btn.label.setDepth(12)
            btn.obj = scene.add.image(btn.label.x, btn.label.y, 'btn').setDepth(11)
            btn.obj.setInteractive({ cursor: 'pointer' })
            btn.obj.on(`pointerdown`, () => {
                btn.obj.setTexture(`btn_press`)
            })
            btn.obj.on(`pointerup`, () => {
                btn.obj.setTexture(`btn`)
                btn.onClick()
            })
            btn.obj.on(`pointerout`, () => {
                btn.obj.setTexture(`btn`)
            })
            i++
        })
    }
}

// class ModalButton extends Phaser.GameObjects.Graphics {
//     constructor(scene: Phaser.Scene, title: string, x: number, y: number, callback?: void) {
//         super(scene)
//         this.title = title
//         this.fillStyle(0xffffff)
//         this.fillRect(x - 20, y - 10, 40, 20)
//         this.label = new Phaser.GameObjects.Text(x, y, title, {
//             align: 'center',
//             fontSize: 18
//         }).setOrigin(0.5)
//         if (callback) {
//             this.setInteractive(Phaser.Geom.Rectangle)
//             this.on(`pointerdown`, callback)
//         }
//         scene.add.existing(this)
//     }
// }

export default Modal
