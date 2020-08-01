class MenuRoom extends HTMLElement {
    constructor() {
        super()
    }
    // async connectedCallback() {
    //     const res = await fetch(`../src/js/components/menu/MenuRoom.html`)

    //     this.attachShadow({ mode: `open` }).innerHTML = await res.text()
    // }
}
customElements.define(`menu-room`, MenuRoom)
