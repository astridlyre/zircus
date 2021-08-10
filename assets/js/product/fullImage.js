import { ZircusElement } from '../utils.js'

export default function fullImage() {
    class FullImage extends HTMLElement {
        #image

        connectedCallback() {
            this.#image = new ZircusElement(
                'img',
                'product__full__img'
            ).render()
            this.appendChild(this.#image)
            this.classList.add('full')
        }

        set hidden(value) {
            this.setAttribute('hidden', value)
        }

        get hidden() {
            return this.getAttribute('hidden') === 'true'
        }

        show() {
            this.#image.src = this.getAttribute('src')
            this.#image.alt = this.getAttribute('alt')
            this.#image.title = this.getAttribute('title')
            this.style.display = 'flex'
            document.getElementById('nav').classList.add('hidden')
            document.getElementById('menu-mobile-btn').classList.add('hidden')
            document.body.classList.add('hide-y')
        }

        hide() {
            this.style.display = 'none'
            document.getElementById('nav').classList.remove('hidden')
            document
                .getElementById('menu-mobile-btn')
                .classList.remove('hidden')
            document.body.classList.remove('hide-y')
        }

        attributeChangedCallback(name, _, newValue) {
            switch (name) {
                case 'src':
                    return this.#image && (this.#image.src = newValue)
                case 'hidden':
                    return requestAnimationFrame(() =>
                        this.hidden ? this.hide() : this.show()
                    )
            }
        }

        set src(value) {
            this.setAttribute('src', value)
        }

        get src() {
            return this.getAttribute('src')
        }

        static get observedAttributes() {
            return ['src', 'hidden']
        }
    }

    customElements.get('zircus-full-image') ||
        customElements.define('zircus-full-image', FullImage)
}
