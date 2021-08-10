import { setAttributes, ZircusElement } from '../utils.js'
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
            setAttributes(this.#fullImage, {
                alt: this.getAttribute('alt'),
                title: this.getAttribute('fulltitle'),
                src: this.getAttribute('fullsrc'),
                hidden: true,
            })
            this.#fullImage.addEventListener(
                'click',
                () => (this.#fullImage.hidden = true)
            )
            setAttributes(this.#image, {
                src: this.getAttribute('src'),
                alt: this.getAttribute('alt'),
                title: `${this.getAttribute('title')} (${this.getAttribute(
                    'viewfull'
                )})`,
            })

            this.#image.addEventListener(
                'pointerenter',
                () => !this.#updating && (this.isHovered = true)
            )
            this.#image.addEventListener(
                'pointerleave',
                () => !this.#updating && (this.isHovered = false)
            )
            this.#image.addEventListener(
                'click',
                () => (this.#fullImage.hidden = false)
            )
        }

        attributeChangedCallback(name, _, newValue) {
            switch (name) {
                case 'alt':
                    return this.#image && (this.#image.alt = newValue)
                case 'title':
                    return (
                        this.#image &&
                        this.#image.setAttribute('title', newValue)
                    )
                case 'src':
                    return this.#image && (this.#image.src = newValue)
                case 'fullsrc':
                    return this.#fullImage && (this.#fullImage.src = newValue)
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
            return ['src', 'hovered', 'alt', 'title', 'fullsrc']
        }
    }

    customElements.get('zircus-product-image') ||
        customElements.define('zircus-product-image', ProductImage)
}
