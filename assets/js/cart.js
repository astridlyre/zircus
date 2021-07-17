import { q, state } from './utils.js'

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
    function setSubtotal() {
        // Set text
        cartSubTotal.innerText = `$${state.cart
            .reduce((acc, item) => (acc += item.price * item.quantity), 0)
            .toFixed(2)}`
        enableButtons()
    }

    function appendItemToFragment(item, fragment) {
        const template = templateEl.content.cloneNode(true)
        const product = template.querySelector('.cart__product')
        const link = template.querySelector('a')
        const img = template.querySelector('img')
        const desc = template.querySelector('p')
        const price = template.querySelector('span')
        const qty = template.querySelector('.input')
        const label = template.querySelector('label')
        const removeBtn = template.querySelector('button')

        link.href = `/products/${item.name
            .toLowerCase()
            .split(' ')
            .join('-')}.html`
        link.addEventListener(
            'click',
            () =>
                (state.currentItem = {
                    type: item.type,
                    color: item.color,
                    size: item.size,
                })
        )
        img.src = item.images.sm_a
        img.alt = `${item.name} ${item.size} ${item.color} underwear`
        desc.textContent = `${item.name} (${item.size})`
        price.textContent = `$${item.price * item.quantity}`
        qty.value = item.quantity
        qty.id = item.type
        qty.setAttribute('name', `${item.name} ${item.size} ${item.color}`)
        label.setAttribute('for', item.type)
        qty.addEventListener('input', () => {
            if (!qty.value) qty.value = 1
            const max = state.inv.find(i => i.type === item.type).quantity
            if (Number(qty.value) > max) qty.value = max
            state.cart = cart =>
                cart.map(i =>
                    i.id === item.id ? { ...i, quantity: Number(qty.value) } : i
                )
            price.textContent = `$${item.price * Number(qty.value)}`
            setSubtotal()
        })

        // Add remove button functionality
        removeBtn.setAttribute(
            'aria-label',
            `Remove ${item.name} size ${item.size} color ${item.color} from cart`
        )
        removeBtn.addEventListener('click', () => {
            state.cart = cart => cart.filter(i => i.id !== item.id)
            product.remove()
            setSubtotal()
            !state.cart.length && renderCartItems()
        })

        return fragment.appendChild(template)
    }

    function renderCartItems() {
        if (!state.cart.length) {
            noItems.style.display = 'block'
            return setSubtotal()
        }
        noItems.style.display = 'none'
        const fragment = new DocumentFragment()
        state.cart.forEach(item => appendItemToFragment(item, fragment))
        list.appendChild(fragment)
        return setSubtotal()
    }

    // Initial render
    renderCartItems()

    // Add event listeners
    checkoutBtn.addEventListener('click', () => {
        if (state.cart.length > 0) location.assign('/checkout')
    })
}
