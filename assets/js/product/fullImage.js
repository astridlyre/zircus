import { ZircusElement, q } from '../utils.js'

export default function fullImage() {
    class FullImage extends HTMLElement {
        constructor() {
            super()
            this.image = new ZircusElement('img', 'product__full__img').render()
            this.appendChild(this.image)
        }

        setImage() {
            this.image.src = this.getAttribute('src') || ''
            this.image.alt = this.getAttribute('alt')
            this.image.title = this.getAttribute('title')
        }

        showFull() {
            this.setImage()
            this.style.display = 'flex'
            q('nav').classList.add('hidden')
            q('menu-mobile-btn').classList.add('hidden')
            document.body.classList.add('hide-y')
        }

        hideFull() {
            this.style.display = 'none'
            q('nav').classList.remove('hidden')
            q('menu-mobile-btn').classList.remove('hidden')
            document.body.classList.remove('hide-y')
        }

        attributeChangedCallback(name, _, newValue) {
            if (name === 'src')
                if (newValue.length > 0) this.showFull()
                else this.hideFull()
        }

        static get observedAttributes() {
            return ['src']
        }
    }

    if (!customElements.get('zircus-full-image'))
        customElements.define('zircus-full-image', FullImage)
}
