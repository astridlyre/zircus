import { appendPreloadLink, ZircusElement } from '../utils.js'

export default () => {
    class Hero extends HTMLElement {
        #images
        #imageElement
        #currentImage = 1

        constructor() {
            super()
            this.#images = new Array(Number(this.getAttribute('num-images')))
                .fill('')
                .map((_, i) =>
                    appendPreloadLink(
                        `${this.getAttribute('image-path')}${i + 1}.jpg`
                    )
                )

            this.#imageElement = new ZircusElement(
                'img',
                'section__hero_image'
            ).render()

            this.appendChild(this.#imageElement)
            this.appendChild(
                new ZircusElement('div', [
                    'bg-light',
                    'rounded-big-top',
                    'absolute',
                    'b-0',
                    'l-0',
                ]).render()
            )
        }

        connectedCallback() {
            this.classList.add('section__hero')
            this.#imageElement.src = this.src
            setInterval(() => {
                this.#imageElement.src = this.src
            }, 4500)
        }

        attributeChangedCallback(name, _, newValue) {
            switch (name) {
                case 'alt':
                    return (this.#imageElement.alt = alt)
                case 'title':
                    return this.#imageElement.setAttribute('title', newValue)
            }
        }

        get currentImage() {
            return this.#currentImage === this.#images.length
                ? (this.#currentImage = 1)
                : this.#currentImage++
        }

        get src() {
            return `${this.getAttribute('image-path')}${this.currentImage}.jpg`
        }
    }

    customElements.get('zircus-hero-image') ||
        customElements.define('zircus-hero-image', Hero)
}
