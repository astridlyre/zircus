import { ZircusElement } from '../utils.js'

export default function tagLine() {
    class TagLine extends HTMLElement {
        connectedCallback() {
            this.tagLines = this.getAttribute('taglines').split('|')

            const textContent =
                this.tagLines[Math.floor(Math.random() * this.tagLines.length)]

            const heading = new ZircusElement('h1', 'home__heading')
            heading.addChild(new ZircusElement('span').addChild(textContent))
            heading.addChild(new ZircusElement('span', 'teal').addChild('.'))

            this.classList.add('home__heading_container')
            this.appendChild(heading.render())
        }
    }

    if (!customElements.get('zircus-tag-line'))
        customElements.define('zircus-tag-line', TagLine)
}