import { Element } from '../utils.js'

export default function tagLine() {
    class TagLine extends HTMLElement {
        constructor() {
            super()
            this.tagLines = this.getAttribute('taglines').split('|')

            const textContent =
                this.tagLines[Math.floor(Math.random() * this.tagLines.length)]

            const heading = new Element('h1', 'home__heading').render()
            const text = new Element('span').render()
            const dot = new Element('span', 'teal').addChild('.').render()
            heading.appendChild(text)
            heading.appendChild(dot)
            text.textContent = textContent
            this.classList.add('home__heading_container')
            this.appendChild(heading)
        }
    }

    if (!customElements.get('tag-line'))
        customElements.define('tag-line', TagLine)
}
