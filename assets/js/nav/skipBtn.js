import { Element, q } from '../utils.js'

export default function SkipToContent() {
    class SkipButton extends HTMLElement {
        constructor() {
            super()

            const button = new Element('button', [
                'skip-to-content',
                'small-spaced-bold',
            ])
                .addChild(this.getAttribute('text'))
                .render()

            const focused = () => q('main-content').focus()

            button.addEventListener('click', focused)
            this.appendChild(button)
        }
    }

    if (!customElements.get('skip-to-content'))
        customElements.define('skip-to-content', SkipButton)
}
