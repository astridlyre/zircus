import { ZircusElement } from '../utils.js'

export default function SkipToContent() {
    class SkipButton extends HTMLElement {
        #button

        constructor() {
            super()
            this.#button = new ZircusElement('button', [
                'skip-to-content',
                'small-spaced-bold',
            ]).render()
            this.appendChild(this.#button)
        }

        connectedCallback() {
            this.#button.setAttribute('title', this.getAttribute('text'))
            this.#button.textContent = this.getAttribute('text')
            this.#button.addEventListener('click', () =>
                document.getElementById('main-content').focus()
            )
        }
    }

    customElements.get('zircus-skip-to-content') ||
        customElements.define('zircus-skip-to-content', SkipButton)
}
