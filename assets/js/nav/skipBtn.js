import { ZircusElement } from '../utils.js'

export default function SkipToContent() {
    class SkipButton extends HTMLElement {
        constructor() {
            super()
            this.button = new ZircusElement('button', [
                'skip-to-content',
                'small-spaced-bold',
            ])
                .addChild(this.getAttribute('text'))
                .event('click', this.focusMainContent)
                .render()

            this.appendChild(this.button)
        }

        focusMainContent() {
            document.getElementById('main-content').focus()
        }
    }

    customElements.get('zircus-skip-to-content') ||
        customElements.define('zircus-skip-to-content', SkipButton)
}
