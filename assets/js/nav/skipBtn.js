import { ZircusElement } from '../utils.js'

export default function SkipToContent() {
    class SkipButton extends HTMLElement {
        connectedCallback() {
            this.button = new ZircusElement('button', [
                'skip-to-content',
                'small-spaced-bold',
            ])
                .addChild(this.getAttribute('text'))
                .event('click', this.focused)

            this.appendChild(this.button.render())
        }

        focused() {
            document.getElementById('main-content').focus()
        }
    }

    if (!customElements.get('zircus-skip-to-content'))
        customElements.define('zircus-skip-to-content', SkipButton)
}
