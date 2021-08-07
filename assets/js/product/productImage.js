import { ZircusElement } from '../utils.js'
import fullImage from './fullImage.js'

export default function productImage() {
    fullImage()
    class ProductImage extends HTMLElement {
        constructor() {
            super()
            this.image = new ZircusElement('img', 'product__img').render()
            this.appendChild(this.image)
        }

        connectedCallback() {
            this.fullImage = this.querySelector('zircus-full-image')
            this.fullImage.addEventListener('click', () =>
                this.fullImage.setAttribute('src', '')
            )
            this.image.src = this.getAttribute('src')
            this.image.alt = this.getAttribute('alt')
            this.image.setAttribute('title', this.getAttribute('title'))
            this.image.addEventListener(
                'pointerenter',
                () => (this.isHovered = true)
            )
            this.image.addEventListener(
                'pointerleave',
                () => (this.isHovered = false)
            )
            this.image.addEventListener('click', () =>
                this.fullImage.setAttribute('src', this.getAttribute('fullsrc'))
            )
        }

        attributeChangedCallback(name, _, newValue) {
            if (name === 'alt') return (this.image.alt = newValue)
            if (name === 'title')
                return this.image.setAttribute('title', newValue)
            if (name === 'src') return (this.image.src = newValue)
        }

        set isHovered(value) {
            this._isHovered = value
            this.isHovered
                ? (this.image.src = this.getAttribute('hovered'))
                : (this.image.src = this.getAttribute('src'))
        }

        get isHovered() {
            return this._isHovered
        }

        static get observedAttributes() {
            return ['src', 'hovered', 'alt', 'title']
        }
    }

    customElements.get('zircus-product-image') ||
        customElements.define('zircus-product-image', ProductImage)
}
