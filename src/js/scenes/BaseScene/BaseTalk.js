import { CONVERSATIONS } from './../../utils/Conversations'
import Talk from './../../components/TalkAction'
import Utils from '../../utils/Utils'

class BaseTalk extends Phaser.Scene {
    constructor() {
        super({ key: 'BaseTalk' })

        this.mainSceneKey
        this.mainScene

        this.talkHud
        this.tteTimer
        this.tte
        this.conversationLabel
        this.currentTalk = 0
        this.tteSuccess
    }

    init(data) {
        if (data) {
            this.mainSceneKey = data.key
            this.mainScene = this.scene.get(this.mainSceneKey)
        }
    }

    create() {
        this.talkHud = this.add.image(0, (this.scale.height / 2) - 163, 'talk').setOrigin(0, 0)
        this.conversationLabel = this.add.text(this.scale.width / 2, this.scale.height / 2, '', {
            align: 'center',
            wordWrap: {
                width: this.scale.width - 400
            },
            fontSize: 20
        }).setOrigin(0.5)
        this.conversationLabel.setVisible(0)
        this.tteTimer = this.time.addEvent({
            delay: 10000,
            callback: this.talkEventWarn,
            callbackScope: this,
            loop: false
        })
    }

    talkEventWarn() {
        // this.currentTalk = Math.floor(Math.random() * (CONVERSATIONS.starters.length - 1))
        this.currentTalk = this.currentTalk < CONVERSATIONS.starters.length - 1 ? this.currentTalk + 1 : 0
        this.conversationLabel.setText(`"${CONVERSATIONS.starters[this.currentTalk]}"`)
        this.conversationLabel.setVisible(1)
        this.talkHud.setTexture('talk-warn')
        this.time.delayedCall(3000, this.talkEvent, [], this)
    }

    talkEvent() {
        this.talkHud.setTexture('talk')
        this.tte = new Talk(this, this.talkHud.x, this.talkHud.y, 1, 3, 500)
    }

    talkingDone(anx, success) {
        if (anx > 0) {
            this.mainScene.anxiety = this.mainScene.ui.anxBar.more(anx)
            this.conversationLabel.setText(CONVERSATIONS.answers.bad[this.currentTalk])
        } else if (anx < 0) {
            this.mainScene.anxiety = this.mainScene.ui.anxBar.less(-anx)
            this.conversationLabel.setText(CONVERSATIONS.answers.good[this.currentTalk])
        } else {
            this.conversationLabel.setText(CONVERSATIONS.answers.neutral[this.currentTalk])
        }
        this.tteSuccess = this.add.text(this.talkHud.width, this.talkHud.y + 201, `${success}%`, { fontSize: 32, align: 'left' })
        this.time.delayedCall(4000, () => {
            this.tteSuccess.setVisible(0)
            this.conversationLabel.setVisible(0)
        }, [], this)

        const nextEventDelay = Utils.getRandomInt()

        this.tteTimer.remove(false)
        this.tteTimer = this.time.addEvent({
            delay: 10000,
            callback: this.talkEventWarn,
            callbackScope: this,
            loop: false
        })
    }
}

export default BaseTalk
