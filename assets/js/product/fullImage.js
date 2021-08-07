import { ZircusElement, q } from '../utils.js'

export default function fullImage() {
    const nav = q('nav')
    const mobileButton = q('menu-mobile-btn')

    class FullImage extends HTMLElement {
        constructor() {
            super()
            this._isHidden = true
            this.image = new ZircusElement('img', 'product__full__img').render()
            this.appendChild(this.image)
        }

        connectedCallback() {
            this.classList.add('full')
            this.setAttribute('src', '')
        }

        set isHidden(value) {
            this._isHidden = value
            this.isHidden ? this.hide() : this.show()
        }

        get isHidden() {
            return this._isHidden
        }

        show() {
            this.image.src = this.getAttribute('src')
            this.image.alt = this.getAttribute('alt')
            this.image.title = this.getAttribute('title')
            this.style.display = 'flex'
            nav.classList.add('hidden')
            mobileButton.classList.add('hidden')
            document.body.classList.add('hide-y')
        }

        hide() {
            this.style.display = 'none'
            nav.classList.remove('hidden')
            mobileButton.classList.remove('hidden')
            document.body.classList.remove('hide-y')
        }

        attributeChangedCallback(name, _, newValue) {
            if (name === 'src') this.isHidden = newValue.length === 0
        }

        static get observedAttributes() {
            return ['src']
        }
    }

    customElements.get('zircus-full-image') ||
        customElements.define('zircus-full-image', FullImage)
}
