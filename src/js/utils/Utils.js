import Phaser, { FOREVER } from 'phaser'

// Fisher–Yates Shuffle taken from https://bost.ocks.org/mike/shuffle/
// @flow
class Utils {
    static shuffle(arr: Array<mixed>): Array<mixed> {
        let m = arr.length
        let t
        let i
        while (m) {
            i = Math.floor(Math.random() * m--)
            t = arr[m]
            arr[m] = arr[i]
            arr[i] = t
        }
        return arr
    }

    static anyKeyDown(keys: Array<Phaser.Input.Keyboard.Key>): boolean {
        let keysPressed = 0
        keys.forEach(key => {
            if (key.isDown) {
                keysPressed++
            }
        })
        return !!keysPressed
    }
}

export default Utils
