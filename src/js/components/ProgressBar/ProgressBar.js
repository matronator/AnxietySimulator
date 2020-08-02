class ProgressBar extends HTMLElement {
    async connectedCallback() {
        const res = await fetch(`src/js/components/ProgressBar/ProgressBar.html`)

        this.attachShadow({ mode: `open` }).innerHTML = await res.text()
        this.progressBar = this.shadowRoot.getElementById(`focusBar`)
        this.progressBarFill = this.progressBar.querySelector(`.progress-bar-fill`)
        this.progressMax = Number(this.progressBar.dataset.barMax)
        window.setInterval(() => {
            this.updateFill(1)
        }, 420)
    }
    updateFill(num) {
        let barFill = Number(this.progressBar.dataset.barValue)
        barFill += num
        const newBarFill = Math.round(((barFill) / (Number(this.progressMax))) * 100)
        this.progressBar.dataset.barValue = newBarFill
        this.progressBar.dataset.barFill = newBarFill
        this.progressBarFill.setAttribute(`style`, `width: ${newBarFill}%;`)
    }
}
customElements.define(`progress-bar`, ProgressBar)
