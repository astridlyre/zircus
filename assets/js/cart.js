import { q, state } from './utils.js'

/*
    Cart performs the functions manage the shopping cart.
    Uses the 'state' object to store state in localStorage
    and updates the 'cart' nav-link upon changes.
*/

export const cart = (function () {
    class Cart {
        constructor() {
            this.cartSubTotal = q('cart-subtotal')
            this.cartTax = q('cart-tax')
            this.cartTotal = q('cart-total')
            this.list = q('cart-products')
            this.checkoutList = q('checkout-products')
            this.checkoutBtn = q('cart-checkout')
            this.payPalBtn = q('cart-paypal')
            this.placeOrderBtn = q('place-order')
            this.template = q('cart-product-template')
            this.noItems = q('cart-products-none')
            this.render()

            this.checkoutBtn &&
                this.checkoutBtn.addEventListener('click', () => {
                    if (state.cart.length > 0) location.assign('/checkout')
                })
        }

        enableButtons() {
            if (state.cart.length > 0)
                return this.checkoutBtn.removeAttribute('disabled')
            return this.checkoutBtn.setAttribute('disabled', true)
        }

        setTotals() {
            if (!this.list) return this
            // Tally up
            this.subtotal = state.cart.reduce(
                (acc, item) => (acc += item.price * item.quantity),
                0
            )
            // Set text
            this.cartSubTotal.innerText = `$${this.subtotal.toFixed(2)}`
            // Update navLink
            this.list && this.enableButtons()
            return this
        }

        render() {
            if (!this.list) return this
            if (!state.cart.length) {
                this.noItems.style.display = 'block'
                return this.setTotals()
            }
            this.noItems.style.display = 'none'
            const fragment = new DocumentFragment()
            state.cart.forEach(item => {
                const template = this.template.content.cloneNode(true)
                const product = template.querySelector('.cart__product')
                const link = template.querySelector('a')
                const img = template.querySelector('img')
                const desc = template.querySelector('p')
                const price = template.querySelector('span')
                const qty = template.querySelector('.input')
                const removeBtn = template.querySelector('button')

                link.href = `/products/${item.name
                    .toLowerCase()
                    .split(' ')
                    .join('-')}.html`
                img.src = item.images.sm_a
                img.alt = item.name
                desc.textContent = `${item.name} - ${item.size}`
                price.textContent = `$${item.price}`
                qty.value = item.quantity
                qty.addEventListener('input', () => {
                    const max = state.inv.find(i => i.id === item.id).quantity
                    if (Number(qty.value) > max) qty.value = max
                    state.cart = cart =>
                        cart.map(i =>
                            i.id === item.id
                                ? { ...i, quantity: Number(qty.value) }
                                : i
                        )
                    this.setTotals()
                })
                removeBtn.addEventListener('click', () => {
                    state.cart = cart => cart.filter(i => i.id !== item.id)
                    this.setTotals()
                    product.remove()
                    !state.cart.length && this.render()
                })

                return fragment.appendChild(template)
            })

            this.list.appendChild(fragment)
            return this.setTotals()
        }
    }

    return new Cart()
})()
