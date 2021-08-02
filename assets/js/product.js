import { q, state, toggler, appendPreloadLink, withLang } from './utils.js'

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
    const addToCartText = {
        en: ['out of stock', 'add to cart'],
        fr: ['non disponible', 'ajouter'],
    }

    let currentColor = color.value

    const addNotificationText = item => ({
        en: `Added ${item.name['en']} to cart`,
        fr: `Ajouté des ${item.name['fr']} au panier`,
    })

    const stockText = qty => ({
        en: ['None available', `Only ${qty} left!`, 'In stock'],
        fr: ['Non disponible', `Il n'en reste que ${qty}!`, 'En stock'],
    })

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
    function setImage(key) {
        return currentItem() && (image.src = currentItem().images[key])
    }

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
    function updatePrice() {
        priceText.textContent = `$${
            Number(price.value) * Number(quantity.value)
        }`
    }

    // Preload images and set default color
    function preloadImages(color) {
        for (const image of ['a-400.png', 'b-400.png', 'a-1920.jpg'])
            appendPreloadLink(
                `/assets/img/products/masked/${prefix.value}-${color}-${image}`
            )
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
        state.notify(withLang(addNotificationText(item)), 'green', () =>
            location.assign(withLang({ en: '/cart', fr: '/fr/panier' }))
        )
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
        stock.innerText = withLang(stockText(0))[0]
        stock.classList.add('out-stock')
        stock.classList.remove('in-stock')
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
        stock.classList.add('in-stock')
        stock.classList.remove('out-stock')
        quantity.removeAttribute('disabled')
        addToCart.removeAttribute('disabled')
        addToCart.textContent = withLang(addToCartText)[1]
    }

    // updateStatus updates the currentItem
    function updateStatus(prevItem) {
        if (!state.inv) return
        const updatedItem = setItem(prevItem) // Update current item
        if (prevItem) {
            size.value = prevItem.size
            color.value = prevItem.color
            state.currentItem = null
        }
        if (!prevItem) productAccent.classList.remove(`${currentColor}-before`)
        productAccent.classList.add(`${color.value}-before`)
        currentColor = color.value
        if (!updatedItem || updatedItem.quantity === 0) outOfStock()
        else inStock(updatedItem)
        setImage('sm_a')
        updatePrice()
    }

    // Set initial status
    updateStatus(state.currentItem)
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
    state.addHook(() => updateStatus())
    state.addHook(() => updateCartBtnQty())
}
