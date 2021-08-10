import { state } from '../utils.js'

/*
    Cart performs the functions manage the shopping cart.
    Uses the 'state' object to store state in localStorage
    and updates the 'cart' nav-link upon changes.
*/
export default function cart() {
    class Cart extends HTMLElement {
        connectedCallback() {
            this.checkoutButton = this.querySelector('#cart-checkout')
            this.subtotalText = this.querySelector('#cart-subtotal')
            this.cartProductsList = this.querySelector('#cart-products')
            this.checkoutButton = this.querySelector('#cart-checkout')
            this.emptyCartPlaceholder = this.querySelector(
                '#cart-products-none'
            )

            this.renderCartProducts()
            this.checkoutButton.addEventListener('click', () => this.navigate())
        }

        disconnectedCallback() {
            this.checkoutButton.removeEventListener('click', () =>
                this.navigate()
            )
        }

        navigate() {
            document.querySelector('zircus-router').page =
                this.getAttribute('checkoutpath')
        }

        enableButtons() {
            return state.cart.length > 0
                ? (this.checkoutButton.disabled = false)
                : (this.checkoutButton.disabled = true)
        }

        updateSubtotal() {
            requestAnimationFrame(() => {
                this.subtotalText.textContent = `$${state.cart
                    .reduce(
                        (acc, item) => (acc += item.price * item.quantity),
                        0
                    )
                    .toFixed(2)}`
                return this.enableButtons() // Check if button should be enabled
            })
        }

        renderCartProducts() {
            if (!state.cart.length) {
                this.emptyCartPlaceholder.style.display = 'block'
                return this.updateSubtotal()
            }
            this.emptyCartPlaceholder.style.display = 'none'
            const fragment = new DocumentFragment()
            state.cart.forEach(item => {
                const el = document.createElement('zircus-cart-product')
                el.item = item
                el.setAttribute('withactions', true)
                el.addEventListener('update-totals', () =>
                    this.updateSubtotal()
                )
                el.addEventListener('render', () => this.renderCartProducts())
                fragment.appendChild(el)
            })
            this.cartProductsList.appendChild(fragment)
            return this.updateSubtotal()
        }
    }

    if (!customElements.get('zircus-cart'))
        customElements.define('zircus-cart', Cart)
}
