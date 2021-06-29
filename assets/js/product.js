import { numberInputHandler, q, state } from './utils.js'
import { cart } from './cart.js'

/* Path for masked product images. Images follow the convention:

  [prefix]-[color]-[view]-[size].png

  Where prefix is either 'ff', 'pf', or 'cf'
  color is 'yellow', 'teal', 'purple', 'black' or 'stripe'
  view is 'a' (front) or 'b' (folded)
  and size is the image size 400, 600 or 1000
*/
(function() {
    const type = q('product-type')
    if (!type) return

    const IMAGE_PATH = '/assets/img/products/masked/'
    const VIEWS = ['a', 'b']
    const COLORS = ['yellow', 'purple', 'teal', 'black', 'stripe']

    class Underwear {
        constructor() {
            this.name = q('product-name')
            this.price = q('product-price')
            this.size = q('product-size')
            this.image = q('product-image')
            this.quantity = q('product-quantity')
            this.color = q('product-color')
            this.type = q('product-type')
            this.addToCart = q('add-to-cart')
            this.quickPurchase = q('quick-purchase')
            this.images = {}
            this.hovered = false

            // Initialize the images
            for (const color of COLORS) {
                const arr = []
                for (const view of VIEWS) {
                    arr.push(`${IMAGE_PATH}${this.type.value}-${color}-${view}-1920.png`)
                }
                this.images[color] = arr
            }

            // Initialize the price
            this.price.innerText = `$${this.getPrice()}`

            // Add event listeners
            this.color.addEventListener('change', () => this.setImage(0))
            this.quantity.addEventListener('input', () => numberInputHandler(this.quantity))
            this.image.addEventListener('pointerover', () => this.hover(this.color.value))
            this.image.addEventListener('pointerleave', () => this.hover(this.color.value))
            this.addToCart.addEventListener('click', () => this.add())

            this.setImage(0)
        }

        add() {
            state.add({
                id: Math.round(Math.random() * 10000),
                name: this.name.innerText,
                color: this.color.value,
                image: this.images[this.color.value][0],
                size: this.size.value,
                quantity: this.quantity.value,
                type: this.type.value
            })
            this.addToCart.classList.add('added')
            setTimeout(() => this.addToCart.classList.remove('added'), 2000)
            this.addToCart.blur()
            cart.updateNavLink()
            return this
        }

        getPrice() {
            return this.t == 'cf' ? 38 : 30
        }

        hover() {
            if (!this.hovered) {
                this.setImage(1)
                return this.hovered = true
            } else {
                this.setImage(0)
                return this.hovered = false
            }
        }

        setImage(n) {
            this.image.src = this.images[this.color.value][n]
            return this
        }
    }

    return new Underwear()
})()
