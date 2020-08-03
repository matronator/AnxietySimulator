class ProgressBar extends HTMLElement {
    static get observedAttributes() {
        return ['min', 'max', 'value', 'fill']
    }
    async connectedCallback() {
        const res = await fetch(`src/js/components/ProgressBar/ProgressBar.html`)

        this.shadow = this.attachShadow({ mode: `open` })
        this.shadow.innerHTML = await res.text()
    }
    updateFill(num) {
        let barFill = parseFloat(this.getAttribute(`fill`))
        barFill += num
        const newBarFill = Number(((barFill) / (Number(this.getAttribute(`max`)))) * 100).toFixed(3)
        this.setAttribute(`value`, barFill)
        this.setAttribute(`fill`, barFill)
        this.progressBar.dataset.barFill = newBarFill
        this.progressBarFill.setAttribute(`style`, `width: ${barFill}%;`)
    }
}
customElements.define(`progress-bar`, ProgressBar)
