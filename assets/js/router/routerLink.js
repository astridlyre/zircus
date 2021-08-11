export default function routerLink() {
    class RouterLink extends HTMLElement {
        #link
        #isActive = false
        #activeFunction

        constructor() {
            super()
            this.#activeFunction = () =>
                window.location.href.includes(this.#link.href)
        }

        connectedCallback() {
            this.#link = this.querySelector('a')
            this.#link.addEventListener('pointerenter', () => this.hovered(), {
                once: true,
            })
            this.#link.addEventListener('click', event => this.clicked(event))
            document.addEventListener('navigated', () => this.setStatus())
            this.setStatus()
        }

        set isActive(value) {
            this.#isActive = value
            this.#isActive
                ? this.#link.classList.add('active')
                : this.#link.classList.remove('active')
        }

        get isActive() {
            return this.#isActive
        }

        set active(func) {
            this.#activeFunction = func
        }

        get active() {
            return this.#activeFunction
        }

        setStatus() {
            this.#activeFunction()
                ? (this.isActive = true)
                : (this.isActive = false)
        }

        disconnectedCallback() {
            this.#link.removeEventListener('click', event =>
                this.clicked(event)
            )
        }

        clicked(event) {
            event.preventDefault()
            document.querySelector('zircus-router').page = this.#link.href
        }

        hovered() {
            document.dispatchEvent(
                new CustomEvent('preload', { detail: this.#link.href })
            )
        }
    }

    customElements.get('zircus-router-link') ||
        customElements.define('zircus-router-link', RouterLink)
}