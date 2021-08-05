import { q, state, withLang } from '../utils.js'
import cartProduct from './cartProduct.js'

/*
    Cart performs the functions manage the shopping cart.
    Uses the 'state' object to store state in localStorage
    and updates the 'cart' nav-link upon changes.
*/
export default function cart() {
    const checkoutBtn = q('cart-checkout')
    if (!checkoutBtn) return // Don't do anything unless on cart page
    const cartSubTotal = q('cart-subtotal')
    const list = q('cart-products')
    const templateEl = q('cart-product-template')
    const noItems = q('cart-products-none')

    // enableButtons enables the checkoutBtn if there are items in cart
    function enableButtons() {
        if (state.cart.length > 0) return (checkoutBtn.disabled = false)
        return (checkoutBtn.disabled = true)
    }

    // setSubtotal updates the subtotal
    function updateSubtotal() {
        // Set text
        cartSubTotal.innerText = `$${state.cart
            .reduce((acc, item) => (acc += item.price * item.quantity), 0)
            .toFixed(2)}`
        enableButtons()
    }

    function renderCartItems() {
        if (!state.cart.length) {
            noItems.style.display = 'block'
            return updateSubtotal()
        }
        noItems.style.display = 'none'
        const fragment = new DocumentFragment()
        state.cart.forEach(item =>
            fragment.appendChild(
                cartProduct({
                    item,
                    templateEl,
                    updateSubtotal,
                    renderCartItems,
                    withActions: true,
                })
            )
        )
        list.appendChild(fragment)
        return updateSubtotal()
    }

    // Initial render
    renderCartItems()

    // Add event listeners
    checkoutBtn.addEventListener('click', () => {
        if (state.cart.length > 0)
            location.assign(
                withLang({
                    en: '/checkout',
                    fr: '/fr/la-caisse',
                })
            )
    })
}
