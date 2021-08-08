import withCartQty from './withCartQty.js'

export default function navMobile() {
    class NavMobile extends HTMLElement {
        cartLink
        #list
        #button
        #isHidden = true

        constructor() {
            super()
            this.classList.add('nav_mobile')
            this.cartLink = this.querySelector('#cart-link-mobile')
            this.#list = this.querySelector('#menu-mobile-list')
            this.#button = this.querySelector('#menu-mobile-btn')
        }

        connectedCallback() {
            this.updateCartLink()
            this.#list.addEventListener('click', () => (this.isHidden = true))
            this.#button.addEventListener(
                'click',
                () => (this.isHidden = !this.isHidden)
            )
            document.addEventListener('cart-updated', () =>
                this.updateCartLink()
            )
        }

        set isHidden(value) {
            this.#isHidden = value
            this.#isHidden ? this.hide() : this.show()
        }

        get isHidden() {
            return this.#isHidden
        }

        // Mobile menu functionality
        hide() {
            this.#list.classList.add('hide')
            document.body.classList.remove('hide-y')
        }
        show() {
            this.#list.classList.remove('hide')
            document.body.classList.add('hide-y')
        }
    }

    Object.assign(NavMobile.prototype, withCartQty())

    customElements.get('zircus-nav-mobile') ||
        customElements.define('zircus-nav-mobile', NavMobile)
}
