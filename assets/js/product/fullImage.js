import { ZircusElement, q } from '../utils.js'

export default function fullImage() {
    const nav = q('nav')
    const mobileButton = q('menu-mobile-btn')
    const { body } = document

    class FullImage extends HTMLElement {
        #isHidden = true
        #image

        connectedCallback() {
            this.#image = new ZircusElement(
                'img',
                'product__full__img'
            ).render()
            this.appendChild(this.#image)
            this.classList.add('full')
        }

        set isHidden(value) {
            this.#isHidden = value
            this.#isHidden ? this.hide() : this.show()
        }

        get isHidden() {
            return this.#isHidden
        }

        show() {
            this.#image.src = this.getAttribute('src')
            this.#image.alt = this.getAttribute('alt')
            this.#image.title = this.getAttribute('title')
            this.style.display = 'flex'
            nav.classList.add('hidden')
            mobileButton.classList.add('hidden')
            body.classList.add('hide-y')
        }

        hide() {
            this.style.display = 'none'
            nav.classList.remove('hidden')
            mobileButton.classList.remove('hidden')
            body.classList.remove('hide-y')
        }

        attributeChangedCallback(name, _, newValue) {
            if (name === 'src') this.isHidden = !newValue
        }

        static get observedAttributes() {
            return ['src']
        }
    }

    customElements.get('zircus-full-image') ||
        customElements.define('zircus-full-image', FullImage)
}
