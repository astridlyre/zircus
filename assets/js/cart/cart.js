import { state, withLang } from '../utils.js'
import cartProduct from './cartProduct.js'

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
            this.productTemplate = this.querySelector('#cart-product-template')
            this.checkoutButton = this.querySelector('#cart-checkout')
            this.emptyCartPlaceholder = this.querySelector(
                '#cart-products-none'
            )

            this.renderCartProducts()
            this.checkoutButton.addEventListener('click', () =>
                document.querySelector('zircus-router').setAttribute(
                    'href',
                    withLang({
                        en: '/checkout',
                        fr: '/fr/la-caisse',
                    })
                )
            )
        }

        enableButtons() {
            return state.cart.length > 0
                ? (this.checkoutButton.disabled = false)
                : (this.checkoutButton.disabled = true)
        }

        updateSubtotal() {
            // Set text
            this.subtotalText.textContent = `$${state.cart
                .reduce((acc, item) => (acc += item.price * item.quantity), 0)
                .toFixed(2)}`
            this.enableButtons() // Check if button should be enabled
        }

        renderCartProducts() {
            if (!state.cart.length) {
                this.emptyCartPlaceholder.style.display = 'block'
                return this.updateSubtotal()
            }
            this.emptyCartPlaceholder.style.display = 'none'
            const fragment = new DocumentFragment()
            state.cart.forEach(item =>
                fragment.appendChild(
                    cartProduct({
                        item,
                        productTemplate: this.productTemplate,
                        updateSubtotal: () => this.updateSubtotal(),
                        renderCartProducts: () => this.renderCartProducts(),
                        withActions: true,
                    })
                )
            )
            this.cartProductsList.appendChild(fragment)
            return this.updateSubtotal()
        }
    }

    if (!customElements.get('zircus-cart'))
        customElements.define('zircus-cart', Cart)
}
