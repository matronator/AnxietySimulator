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

    /**
     * Returns a random number between min (inclusive) and max (exclusive)
     */
    static getRandomArbitrary(min: number, max: number): number {
        return (Math.random() * (max - min)) + min
    }

    /**
     * Returns a random integer between min (inclusive) and max (inclusive).
     * The value is no lower than min (or the next integer greater than min
     * if min isn't an integer) and no greater than max (or the next integer
     * lower than max if max isn't an integer).
     * Using Math.round() will give you a non-uniform distribution!
     */
    static getRandomInt(_min: number, _max: number): number {
        const min = Math.ceil(_min)
        const max = Math.floor(_max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
}

export default Utils
