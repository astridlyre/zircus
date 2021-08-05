import {
    q,
    state,
    toggler,
    appendPreloadLink,
    withLang,
    switchClass,
} from '../utils.js'
import intText from '../int/intText.js'

/* Path for masked product images. Images follow the convention:
 
  [prefix]-[color]-[view]-[size].png
 
  Where prefix is either 'ff', 'pf', or 'cf'
  color is 'yellow', 'teal', 'purple', 'black' or 'stripe'
  view is 'a' (front) or 'b' (folded)
  and size is the image size 400, 600 or 1000
*/
export default function product() {
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
    const addToCartText = intText.product.addToCart
    const addNotificationText = intText.product.addNotificationText
    const stockText = intText.product.stockText

    let currentColor = color.value

    // Get and set item
    const [currentItem, setItem] = (() => {
        let currentItem = null
        return [
            () => currentItem,
            prevItem =>
                (currentItem = state.inv.find(item =>
                    prevItem
                        ? item.type === prevItem.type
                        : item.type ===
                          `${prefix.value}-${color.value}-${size.value}`
                )),
        ]
    })()

    // Sets product image
    const setImage = key =>
        currentItem() && (image.src = currentItem().images[key])

    // Image hover handler
    const handleHoverImage = toggler(
        false,
        x => !x,
        hovered => (hovered ? setImage('sm_b') : setImage('sm_a'))
    )

    // Full image view handler
    const handleViewFull = toggler(
        false,
        x => !x,
        showFull => {
            if (showFull) {
                bigImage.src = currentItem().images['lg_a']
                bigImageEl.style.display = 'flex'
                q('nav').classList.add('hidden')
                q('menu-mobile-btn').classList.add('hidden')
                document.body.classList.add('hide-y')
            } else {
                bigImageEl.style.display = 'none'
                q('nav').classList.remove('hidden')
                q('menu-mobile-btn').classList.remove('hidden')
                document.body.classList.remove('hide-y')
            }
        }
    )

    // Set price of product
    const updatePrice = () =>
        (priceText.textContent = `$${
            Number(price.value) * Number(quantity.value)
        }`)

    // Preload images and set default color
    const preloadImages = color =>
        ['a-400.png', 'b-400.png', 'a-1920.jpg'].forEach(image =>
            appendPreloadLink(
                `/assets/img/products/masked/${prefix.value}-${color}-${image}`
            )
        )

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
        // Otherwise update existing item
        if (state.cart.find(i => i.type === item.type)) updateCartItem(item)
        // Or add a new item
        else addNewCartItem(item)
        state.notify(withLang(addNotificationText(item)), 'green', () =>
            location.assign(withLang({ en: '/cart', fr: '/fr/panier' }))
        )
        addToCart.blur()
    }

    // updateCartItem updates an existing cart item's quantity
    function updateCartItem(item) {
        const withQuantity = obj => ({
            ...obj,
            quantity: obj.quantity + Number(quantity.value),
        })
        return (state.cart = cart =>
            cart.map(i => (i.type === item.type ? withQuantity(i) : i)))
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
        stock.innerText = withLang(stockText(0))[0]
        switchClass(stock, 'in-stock', 'out-stock')
        quantity.setAttribute('disabled', true)
        addToCart.setAttribute('disabled', true)
        addToCart.innerText = withLang(addToCartText)[0]
    }

    // inStock sets in-stock status
    function inStock(updatedItem) {
        const text = withLang(stockText(updatedItem.quantity))
        stock.innerText = `${updatedItem.quantity > 5 ? text[2] : text[1]}`
        if (updatedItem.quantity < Number(quantity.value))
            quantity.value = updatedItem.quantity
        switchClass(stock, 'out-stock', 'in-stock')
        quantity.removeAttribute('disabled')
        addToCart.removeAttribute('disabled')
        addToCart.textContent = withLang(addToCartText)[1]
    }

    // updateStatus updates the currentItem
    function updateStatus({ inv, currentItem } = state) {
        if (!inv) return
        const updatedItem = setItem(currentItem) // Update current item
        if (currentItem) {
            size.value = currentItem.size
            color.value = currentItem.color
            state.currentItem = null
        }
        switchClass(
            productAccent,
            `${currentColor}-before`,
            `${color.value}-before`
        )
        currentColor = color.value
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
    })
    quantity.addEventListener('input', () => {
        const max = currentItem().quantity
        if (Number(quantity.value) > max) quantity.value = max
        priceText.textContent = `$${
            Number(quantity.value) * Number(price.value)
        }`
    })
    size.addEventListener('input', () => updateStatus())
    image.addEventListener('pointerover', () => handleHoverImage())
    image.addEventListener('pointerleave', () => handleHoverImage())
    image.addEventListener('click', () => handleViewFull())
    bigImageEl.addEventListener('click', () => handleViewFull())
    addToCart.addEventListener('click', handleAddToCart)
    goToCart.addEventListener('click', () =>
        location.assign(
            withLang({
                en: '/cart',
                fr: '/fr/panier',
            })
        )
    )

    // Register hooks
    state.addHook({ hook: updateStatus, key: 'inv' })
    state.addHook({ hook: updateCartBtnQty, key: 'cart' })
}
