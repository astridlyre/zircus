import { q, state } from './utils.js'

;(function () {
    class Menu {
        constructor() {
            this.navLink = q('cart-link')
            this.navLinkMobile = q('cart-link-mobile')
            this.menu = q('menu-mobile-list')
            this.btn = q('menu-mobile-btn')
            this.hidden = true

            // Register the update function hook
            state.addHook(() => this.updateNavLink())
            this.updateNavLink()

            this.btn.addEventListener('click', () => {
                this.hidden ? this.show() : this.hide()
            })

            this.menu.addEventListener('click', () => this.hide())
        }

        hide() {
            this.hidden = true
            this.menu.classList.add('hide')
        }

        show() {
            this.hidden = false
            this.menu.classList.remove('hide')
        }

        // Updates the nav link when cart items change
        updateNavLink() {
            if (state.cart.length > 0) {
                const totalItems = state.cart.reduce(
                    (acc, item) => acc + item.quantity,
                    0
                )
                this.navLink.innerText = `cart (${totalItems})`
                this.navLinkMobile.innerText = `cart (${totalItems})`
            } else {
                this.navLink.innerText = 'cart'
                this.navLinkMobile.innerText = 'cart'
            }
            return this
        }
    }

    return new Menu()
})()
