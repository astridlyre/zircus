import { q, state, Element, toggler } from './utils.js'

/* Path for masked product images. Images follow the convention:
 
  [prefix]-[color]-[view]-[size].png
 
  Where prefix is either 'ff', 'pf', or 'cf'
  color is 'yellow', 'teal', 'purple', 'black' or 'stripe'
  view is 'a' (front) or 'b' (folded)
  and size is the image size 400, 600 or 1000
*/
;(function () {
    const prefix = q('product-prefix')
    if (!prefix) return // Don't do anything unless on product page
    const price = q('product-price')
    const priceText = q('product-price-text')
    const size = q('product-size')
    const image = q('product-image')
    const bigImageEl = q('product-image-full')
    const bigImage = q('product-image-full-image')
    const quantity = q('product-quantity')
    const color = q('product-color')
    const defaultColor = q('product-default-color')
    const addToCart = q('add-to-cart')
    const goToCart = q('go-to-cart')
    const goToCartQty = q('go-to-cart-qty')
    const productAccent = q('product-accent')
    const stock = q('product-stock')
    let currentColor = color.value

    // Sets product image
    function setImage(key) {
        return item.get() && (image.src = item.get().images[key])
    }

    // Image hover handler
    const handleHoverImage = toggler(false, hovered =>
        hovered ? setImage('sm_b') : setImage('sm_a')
    )

    // Full image view handler
    const handleViewFull = toggler(false, showFull => {
        if (showFull) {
            bigImage.src = item.get().images['lg_a']
            bigImageEl.style.display = 'flex'
            document.body.classList.add('hide-y')
        } else {
            bigImageEl.style.display = 'none'
            document.body.classList.remove('hide-y')
        }
    })

    // Get and set item
    const item = (() => {
        let currentItem = null
        return {
            set: () =>
                (currentItem = state.inv.find(
                    item =>
                        item.type ===
                        `${prefix.value}-${color.value}-${size.value}`
                )),
            get: () => currentItem,
        }
    })()
    item.set()

    // Set price of product
    priceText.textContent = `$${Number(price.value) * Number(quantity.value)}`

    // Preload images and set default color
    function preloadImages(color) {
        for (const image of [
            'a-400.png',
            'b-400.png',
            'a-1920.png',
            'b-1920.png',
        ]) {
            const preload = new Element('link', null, {
                href: `/assets/img/products/masked/${prefix.value}-${color}-${image}`,
                rel: 'prefetch',
                as: 'image',
            })
            document.head.appendChild(preload.render())
        }
    }

    for (const child of color.children) {
        preloadImages(child.value)
        if (child.value === defaultColor.value) {
            child.setAttribute('selected', true)
            productAccent.classList.add(`${child.value}-before`)
            currentColor = child.value // set currentColor
        }
    }

    // addItemToCart adds the currentItem (item.get()) to the cart, or updates
    // an exisiting item's quantity
    function addItemToCart() {
        const currentItem = item.get()

        // If not enough items in stock
        if (
            currentItem.quantity - Number(quantity.value) < 0 ||
            !currentItem.quantity
        )
            return

        // Update quantity of current cart items
        if (state.cart.find(item => item.type === currentItem.type)) {
            state.cart = cart =>
                cart.map(i =>
                    i.type === currentItem.type
                        ? {
                              ...i,
                              quantity: i.quantity + Number(quantity.value),
                          }
                        : i
                )
        } else {
            // Otherwise add new item to cart
            state.cart = cart =>
                cart.concat({
                    ...currentItem,
                    quantity: Number(quantity.value),
                })
        }
        addToCart.blur()
    }

    // updateCartBtnQty updates the number of items shows in the cart button
    function updateCartBtnQty() {
        const totalItems = state.cart.reduce(
            (acc, item) => acc + item.quantity,
            0
        )
        goToCartQty.innerText = `${totalItems > 0 ? `(${totalItems})` : ''}`
    }

    // updateStatus updates the currentItem
    function updateStatus() {
        if (!state.inv) return
        const updatedItem = item.set()
        if (!updatedItem || updatedItem.quantity === 0) {
            stock.innerText = 'None available'
            stock.classList.add('out-stock')
            stock.classList.remove('in-stock')
            quantity.setAttribute('disabled', true)
            addToCart.setAttribute('disabled', true)
            addToCart.innerText = 'out of stock'
        } else {
            stock.innerText = `${
                updatedItem.quantity > 5
                    ? 'In stock'
                    : `Only ${updatedItem.quantity} left`
            }`
            stock.classList.add('in-stock')
            stock.classList.remove('out-stock')
            quantity.removeAttribute('disabled')
            addToCart.removeAttribute('disabled')
            addToCart.innerHTML = `<span class="underline">a</span>dd to cart`
        }
        setImage('sm_a')
    }

    // Set initial status
    updateStatus()
    updateCartBtnQty()

    // Add event listeners
    color.addEventListener('change', () => {
        setImage('sm_a')
        updateStatus()
        productAccent.classList.add(`${color.value}-before`)
        productAccent.classList.remove(`${currentColor}-before`)
        currentColor = color.value
    })
    quantity.addEventListener('input', () => {
        const max = item.get().quantity
        if (Number(quantity.value) > max) quantity.value = max
        priceText.textContent = `$${
            Number(quantity.value) * Number(price.value)
        }`
    })
    size.addEventListener('input', updateStatus)
    image.addEventListener('pointerover', () => handleHoverImage.next())
    image.addEventListener('pointerleave', () => handleHoverImage.next())
    image.addEventListener('click', () => handleViewFull.next())
    bigImageEl.addEventListener('click', () => handleViewFull.next())
    addToCart.addEventListener('click', addItemToCart)
    goToCart.addEventListener('click', () => location.assign('/cart'))
    state.addHook(updateStatus)
    state.addHook(updateCartBtnQty)
})()
