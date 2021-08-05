import { Element } from '../utils.js'

export default function SkipToContent() {
    class SkipButton extends HTMLElement {
        connectedCallback() {
            this.button = new Element('button', [
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

    if (!customElements.get('skip-to-content'))
        customElements.define('skip-to-content', SkipButton)
}
