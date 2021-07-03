import { q, state } from './utils.js'

(function() {
    class Menu {
        constructor() {
            this.navLink = q("cart-link")
            this.navLinkMobile = q("cart-link-mobile")
            this.menu = q('menu-mobile-list')
            this.btn = q('menu-mobile-btn')
            this.hidden = true

            // Register the update function hook
            state.addHook(() => this.updateNavLink())
            this.updateNavLink()

            this.btn.addEventListener('click', () => {
                this.hidden ? this.show() : this.hide()
            })

            this.menu.addEventListener('click', () => {
                this.hide()
            })
        }

        hide() {
            this.hidden = true
            this.menu.classList.add('hidden')
        }

        show() {
            this.hidden = false
            this.menu.classList.remove('hidden')
        }

        // Updates the nav link when cart items change
        updateNavLink() {
            if (state.get().cart.length > 0) {
                let totalItems = 0
                state.get().cart.forEach((item) => {
                    totalItems += item.quantity
                })
                this.navLink.innerText = `cart (${totalItems})`
                this.navLinkMobile.innerText = `cart (${totalItems})`
            } else {
                this.navLink.innerText = "cart"
                this.navLinkMobile.innerText = "cart"
            }
            return this
        }
    }

    return new Menu()
})()
