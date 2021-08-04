import { Element, q } from './utils.js'

export default function SkipToContent() {
    class SkipButton extends HTMLElement {
        constructor() {
            super()

            const button = new Element(
                'button',
                ['skip-to-content', 'small-spaced-bold'],
                {
                    type: 'button',
                    tabIndex: '0',
                }
            )
                .addChild(this.getAttribute('text'))
                .render()

            button.addEventListener('focus', () => this.focused())
            this.appendChild(button)
        }

        focused() {
            return q('main-content').focus()
        }
    }

    if (!customElements.get('skip-to-content'))
        customElements.define('skip-to-content', SkipButton)
}
