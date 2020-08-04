fetch(`src/js/components/ProgressBar/ProgressBar.html`)
    .then(stream => stream.text())
    .then(text => define(text))

function define(html) {
    class CustomProgress extends HTMLElement {
        static get observedAttributes() {
            return ['max', 'value', 'fill']
        }
        set value(value) {
            this._value = parseFloat(value)
            this._fill = parseFloat(value) / this._max * 100
        }
        get value() {
            return parseFloat(this._value)
        }
        set max(max) {
            this._max = max
        }
        get max() {
            return parseFloat(this._max)
        }
        set fill(fill) {
            this._fill = fill
            const bar = this.shadow.querySelector(`.progress-bar-fill`)
            if (bar) {
                bar.setAttribute(`style`, `width: ${this._fill}%`)
            }
        }
        get fill() {
            return parseFloat(this._fill)
        }
        constructor() {
            super()
            const shadow = this.attachShadow({ mode: `open` })
            shadow.innerHTML = html
            this.shadow = shadow
            this.max = 100
            this.fill = 50
        }
        attributeChangedCallback(name, oldValue, newValue) {
            if (name === `value` && oldValue !== newValue) {
                this.value = parseFloat(newValue)
                const bar = this.shadow.querySelector(`.progress-bar-fill`)
                if (bar) {
                    bar.setAttribute(`style`, `width: ${this.fill}%`)
                }
            }
        }
    }
    customElements.define(`progress-bar`, CustomProgress)
}
