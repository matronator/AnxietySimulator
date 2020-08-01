class HTMLObject extends HTMLElement {
    async connectedCallback() {
        const res = await fetch(`component.html`)

        this.attachShadow({ mode: `open` }).innerHTML = await res.text()
    }
}
customElements.define(`base-object`, HTMLObject)
