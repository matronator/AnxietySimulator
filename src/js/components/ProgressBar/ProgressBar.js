fetch(`src/js/components/ProgressBar/ProgressBar.html`)
    .then(stream => stream.text())
    .then(text => define(text))

function define(html) {
    class CustomProgress extends HTMLElement {
        static get observedAttributes() {
            return ['max', 'value']
        }
        constructor() {
            super()
            const shadow = this.attachShadow({ mode: `open` })
            shadow.innerHTML = html
            this.shadow = shadow
            this.max = this.hasAttribute(`max`) ? this.getAttribute(`max`) : 100
            this.value = this.hasAttribute(`value`) ? this.getAttribute(`value`) : 0
            this.fill = this.value / this.max * 100
        }
        attributeChangedCallback(name, oldValue, newValue) {
            const bar = this.shadow.querySelector(`.progress-bar-fill`)
            if (name === `value` && oldValue !== newValue) {
                this.value = parseFloat(newValue)
                bar.setAttribute(`style`, `width: ${this.value / this.max * 100}%;`)
            } else if (name === `max` && oldValue !== newValue) {
                this.max = parseFloat(newValue)
                bar.setAttribute(`style`, `width: ${this.value / this.max * 100}%;`)
            }
        }
    }
    customElements.define(`progress-bar`, CustomProgress)
}
