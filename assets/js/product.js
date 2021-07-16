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

    // Get and set item
    const [currentItem, setItem] = (() => {
        let currentItem = null
        return [
            () => currentItem,
            () =>
                (currentItem = state.inv.find(
                    item =>
                        item.type ===
                        `${prefix.value}-${color.value}-${size.value}`
                )),
        ]
    })()
    setItem()

    // Sets product image
    function setImage(key) {
        return currentItem() && (image.src = currentItem().images[key])
    }

    // Image hover handler
    const handleHoverImage = toggler(false, hovered =>
        hovered ? setImage('sm_b') : setImage('sm_a')
    )

    // Full image view handler
    const handleViewFull = toggler(false, showFull => {
        if (showFull) {
            bigImage.src = currentItem().images['lg_a']
            bigImageEl.style.display = 'flex'
            document.body.classList.add('hide-y')
        } else {
            bigImageEl.style.display = 'none'
            document.body.classList.remove('hide-y')
        }
    })

    // Set price of product
    function updatePrice() {
        priceText.textContent = `$${
            Number(price.value) * Number(quantity.value)
        }`
    }

    // Preload images and set default color
    function preloadImages(color) {
        for (const image of ['a-400.png', 'b-400.png', 'a-1920.png']) {
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
    function handleAddToCart() {
        const item = currentItem()
        // If not enough items in stock
        if (item.quantity - Number(quantity.value) < 0 || !item.quantity) return
        if (state.cart.find(i => i.type === item.type)) updateCartItem(item)
        else addNewCartItem(item)
        addToCart.blur()
    }

    // updateCartItem updates an existing cart item's quantity
    function updateCartItem(item) {
        return (state.cart = cart =>
            cart.map(i =>
                i.type === item.type
                    ? {
                          ...i,
                          quantity: i.quantity + Number(quantity.value),
                      }
                    : i
            ))
    }

    // addNewCartItem adds a new item to cart
    function addNewCartItem(item) {
        return (state.cart = cart =>
            cart.concat({
                ...item,
                quantity: Number(quantity.value),
            }))
    }

    // updateCartBtnQty updates the number of items shows in the cart button
    function updateCartBtnQty() {
        const totalItems = state.cart.reduce(
            (acc, item) => acc + item.quantity,
            0
        )
        goToCartQty.innerText = `${totalItems > 0 ? `(${totalItems})` : ''}`
    }

    // outOfStock sets out-of-stock status
    function outOfStock() {
        stock.innerText = 'None available'
        stock.classList.add('out-stock')
        stock.classList.remove('in-stock')
        quantity.setAttribute('disabled', true)
        addToCart.setAttribute('disabled', true)
        addToCart.innerText = 'out of stock'
    }

    // inStock sets in-stock status
    function inStock(updatedItem) {
        stock.innerText = `${
            updatedItem.quantity > 5
                ? 'In stock'
                : `Only ${updatedItem.quantity} left`
        }`
        if (updatedItem.quantity < Number(quantity.value))
            quantity.value = updatedItem.quantity
        stock.classList.add('in-stock')
        stock.classList.remove('out-stock')
        quantity.removeAttribute('disabled')
        addToCart.removeAttribute('disabled')
        addToCart.textContent = 'add to cart'
    }

    // updateStatus updates the currentItem
    function updateStatus() {
        if (!state.inv) return
        const updatedItem = setItem() // Update current item
        if (!updatedItem || updatedItem.quantity === 0) outOfStock()
        else inStock(updatedItem)
        setImage('sm_a')
        updatePrice()
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
        const max = currentItem().quantity
        if (Number(quantity.value) > max) quantity.value = max
        priceText.textContent = `$${
            Number(quantity.value) * Number(price.value)
        }`
    })
    size.addEventListener('input', updateStatus)
    image.addEventListener('pointerover', () => handleHoverImage())
    image.addEventListener('pointerleave', () => handleHoverImage())
    image.addEventListener('click', () => handleViewFull())
    bigImageEl.addEventListener('click', () => handleViewFull())
    addToCart.addEventListener('click', handleAddToCart)
    goToCart.addEventListener('click', () => location.assign('/cart'))

    // Register hooks
    state.addHook(updateStatus)
    state.addHook(updateCartBtnQty)
})()
