import { ZircusElement } from '../utils.js'
import fullImage from './fullImage.js'

export default function productImage() {
    fullImage()
    class ProductImage extends HTMLElement {
        #image
        #isHovered = false
        #didHover = false
        #fullImage

        constructor() {
            super()
            this.#image = new ZircusElement('img', 'product__img').render()
            this.#fullImage = document.createElement('zircus-full-image')
            this.appendChild(this.#image)
            this.appendChild(this.#fullImage)
        }

        connectedCallback() {
            this.#fullImage.setAttribute('alt', this.getAttribute('alt'))
            this.#fullImage.setAttribute(
                'title',
                this.getAttribute('fulltitle')
            )
            this.#fullImage.addEventListener('click', () =>
                this.#fullImage.removeAttribute('src')
            )
            this.#image.src = this.getAttribute('src')
            this.#image.alt = this.getAttribute('alt')
            this.#image.setAttribute(
                'title',
                `${this.getAttribute('title')} (${this.getAttribute(
                    'viewfull'
                )})`
            )
            this.#image.addEventListener('pointerenter', () => {
                if (this.#didHover) return
                this.isHovered = true
                setTimeout(() => (this.#didHover = false), 200)
            })
            this.#image.addEventListener('pointerleave', () => {
                if (this.#didHover) return
                this.isHovered = false
                setTimeout(() => (this.#didHover = false), 200)
            })
            this.#image.addEventListener('click', () =>
                this.#fullImage.setAttribute(
                    'src',
                    this.getAttribute('fullsrc')
                )
            )
        }

        attributeChangedCallback(name, _, newValue) {
            switch (name) {
                case 'alt':
                    return (this.#image.alt = newValue)
                case 'title':
                    return this.#image.setAttribute('title', newValue)
                case 'src':
                    return (this.#image.src = newValue)
            }
        }

        set isHovered(value) {
            this.#isHovered = value
            this.#isHovered
                ? (this.#image.src = this.getAttribute('hovered'))
                : (this.#image.src = this.getAttribute('src'))
        }

        get isHovered() {
            return this.#isHovered
        }

        static get observedAttributes() {
            return ['src', 'hovered', 'alt', 'title']
        }
    }

    customElements.get('zircus-product-image') ||
        customElements.define('zircus-product-image', ProductImage)
}
