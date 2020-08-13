import ProgressMeter from './ProgressMeter'

class AnxietyBar extends ProgressMeter {
    constructor(scene, x, y, width, height) {
        super(scene, x, y, width, height)
        this.text = 'Anxiety:'
        this.draw()
    }
}

export default AnxietyBar
