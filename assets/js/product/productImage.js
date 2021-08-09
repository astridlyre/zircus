import { ZircusElement } from '../utils.js'
import fullImage from './fullImage.js'

export default function productImage() {
    fullImage()
    class ProductImage extends HTMLElement {
        #image
        #isHovered = false
        #updating = false
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
                if (this.#updating) return
                this.isHovered = true
            })
            this.#image.addEventListener('pointerleave', () => {
                if (this.#updating) return
                this.isHovered = false
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
            requestAnimationFrame(() => {
                this.#isHovered
                    ? (this.#image.src = this.getAttribute('hovered'))
                    : (this.#image.src = this.getAttribute('src'))
                this.#updating = false
            })
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
