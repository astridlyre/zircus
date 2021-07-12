import { numberInputHandler, q, state, Element } from './utils.js'

/* Path for masked product images. Images follow the convention:
 
  [prefix]-[color]-[view]-[size].png
 
  Where prefix is either 'ff', 'pf', or 'cf'
  color is 'yellow', 'teal', 'purple', 'black' or 'stripe'
  view is 'a' (front) or 'b' (folded)
  and size is the image size 400, 600 or 1000
*/
;(function () {
    // Don't do anything on pages other than product page
    const prefix = q('product-prefix')
    if (!prefix) return

    class Product {
        constructor() {
            this.name = q('product-name')
            this.price = q('product-price')
            this.priceText = q('product-price-text')
            this.prefix = q('product-prefix')
            this.size = q('product-size')
            this.image = q('product-image')
            this.bigImageEl = q('product-image-full')
            this.bigImage = q('product-image-full-image')
            this.quantity = q('product-quantity')
            this.color = q('product-color')
            this.defaultColor = q('product-default-color')
            this.addToCart = q('add-to-cart')
            this.cartBtn = q('cart-quantity')
            this.goToCart = q('go-to-cart')
            this.goToCartQty = q('go-to-cart-qty')
            this.cartSpinner = q('add-to-cart-spinner')
            this.productAccent = q('product-accent')
            this.stock = q('product-stock')
            this.hovered = false
            this.currentColor = this.color.value

            // Preload images and set default color
            for (const child of this.color.children) {
                this.preloadImages(child.value)
                if (child.value === this.defaultColor.value) {
                    child.setAttribute('selected', true)
                    this.productAccent.classList.add(`${child.value}-before`)
                    this.currentColor = child.value
                }
            }

            this.priceText.textContent = `$${
                Number(this.price.value) * Number(this.quantity.value)
            }`

            // Add event listeners
            this.color.addEventListener('change', () => {
                this.setImage('sm_a')
                this.updateStatus()
                this.productAccent.classList.add(`${this.color.value}-before`)
                this.productAccent.classList.remove(
                    `${this.currentColor}-before`
                )
                this.currentColor = this.color.value
            })
            this.quantity.addEventListener('input', () => {
                const max = state.inv.find(i => i.type === this.type).quantity
                if (Number(this.quantity.value) > max) this.quantity.value = max
                this.priceText.textContent = `$${
                    Number(this.quantity.value) * Number(this.price.value)
                }`
            })
            this.size.addEventListener('input', () => this.updateStatus())
            this.image.addEventListener('pointerover', () => this.hover())
            this.image.addEventListener('pointerleave', () => this.hover())
            this.image.addEventListener('click', () => this.viewFull())
            this.bigImageEl.addEventListener('click', () => this.hideFull())
            this.addToCart.addEventListener('click', () => this.add())
            this.goToCart.addEventListener('click', () =>
                location.assign('/cart')
            )
            state.addHook(() => this.updateStatus())
            state.addHook(() => this.updateCartBtnQty())
        }

        updateCartBtnQty() {
            const totalItems = state.cart.reduce(
                (acc, item) => acc + item.quantity,
                0
            )
            this.goToCartQty.innerText = `${
                totalItems > 0 ? `(${totalItems})` : ''
            }`
        }

        get type() {
            return `${this.prefix.value}-${this.color.value}-${this.size.value}`
        }

        preloadImages(color) {
            for (const image of [
                'a-400.png',
                'b-400.png',
                'a-1920.png',
                'b-1920.png',
            ]) {
                const preload = new Element('link', null, {
                    href: `/assets/img/products/masked/${this.prefix.value}-${color}-${image}`,
                    rel: 'prefetch',
                    as: 'image',
                })
                document.head.appendChild(preload.render())
            }
        }

        // Add a new underwear item to cart
        add() {
            // If not enough items in stock
            if (
                this.item.quantity - Number(this.quantity.value) < 0 ||
                !this.item.quantity
            )
                return this

            // Update quantity of current cart items
            if (state.cart.find(item => item.type === this.type)) {
                state.cart = cart =>
                    cart.map(i =>
                        i.type === this.type
                            ? {
                                  ...i,
                                  quantity:
                                      i.quantity + Number(this.quantity.value),
                              }
                            : i
                    )
            } else {
                // Otherwise add new item to cart
                state.cart = cart =>
                    cart.concat({
                        ...state.inv.find(item => item.type === this.type),
                        quantity: Number(this.quantity.value),
                    })
            }
            this.addToCart.blur()
            return this
        }

        // Change pic on hover
        hover() {
            if (!this.hovered) {
                this.setImage('sm_b')
                this.hovered = true
            } else {
                this.setImage('sm_a')
                this.hovered = false
            }
        }

        // Show fullsize pic
        viewFull() {
            this.bigImage.src = this.item.images['lg_a']
            this.bigImageEl.style.display = 'flex'
            document.body.classList.add('hide-y')
        }

        // Hide fullsize pic
        hideFull() {
            this.bigImageEl.style.display = 'none'
            document.body.classList.remove('hide-y')
        }

        // Change product image
        setImage(key) {
            if (!this.item) return
            if (this.item.images[key]) this.image.src = this.item.images[key]
            return this
        }

        // Update status depending on if inventory is available
        updateStatus() {
            if (!this.item || this.item.quantity === 0) {
                this.stock.innerText = 'None available'
                this.stock.classList.add('out-stock')
                this.stock.classList.remove('in-stock')
                this.quantity.setAttribute('disabled', true)
                this.addToCart.setAttribute('disabled', true)
                this.addToCart.innerText = 'out of stock'
            } else {
                this.stock.innerText = `${
                    this.item.quantity > 5
                        ? 'In stock'
                        : `Only ${this.item.quantity} left`
                }`
                this.stock.classList.add('in-stock')
                this.stock.classList.remove('out-stock')
                this.quantity.removeAttribute('disabled')
                this.addToCart.removeAttribute('disabled')
                this.addToCart.innerText = 'add to cart'
            }
            this.setImage('sm_a')
            return this
        }

        // Return item object with quantity and price
        get item() {
            return state.inv.find(item => item.type === this.type)
        }
    }

    return new Product()
})()
