import { Element } from '../utils.js'

export default function tagLine() {
    class TagLine extends HTMLElement {
        connectedCallback() {
            this.tagLines = this.getAttribute('taglines').split('|')

            const textContent =
                this.tagLines[Math.floor(Math.random() * this.tagLines.length)]

            const heading = new Element('h1', 'home__heading')
            heading.addChild(new Element('span').addChild(textContent))
            heading.addChild(new Element('span', 'teal').addChild('.'))

            this.classList.add('home__heading_container')
            this.appendChild(heading.render())
        }
    }

    if (!customElements.get('tag-line'))
        customElements.define('tag-line', TagLine)
}
