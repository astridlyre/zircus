import { state } from '../utils.js'
import withCartQty from './withCartQty.js'

export default function navMobile() {
    class NavMobile extends HTMLElement {
        constructor() {
            super()

            this._hidden = true
            this.classList.add('nav_mobile')
            this.cartLink = this.querySelector('#cart-link-mobile')
            this.list = this.querySelector('#menu-mobile-list')
            this.list.addEventListener('click', () => this.hide())
            this.button = this.querySelector('#menu-mobile-btn')
            this.button.addEventListener('click', () =>
                this._hidden ? this.show() : this.hide()
            )

            this.updateCartLink([this.cartLink])
            state.addHook({
                hook: () => this.updateCartLink([this.cartLink]),
                key: 'cart',
            })
        }

        // Mobile menu functionality
        hide() {
            this._hidden = true
            this.list.classList.add('hide')
            document.body.classList.remove('hide-y')
        }
        show() {
            this._hidden = false
            this.list.classList.remove('hide')
            document.body.classList.add('hide-y')
        }
    }

    Object.assign(NavMobile.prototype, withCartQty())

    if (!customElements.get('nav-mobile'))
        customElements.define('nav-mobile', NavMobile)
}
