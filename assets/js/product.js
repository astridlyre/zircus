import { numberInputHandler, q, state } from "./utils.js"
import { cart } from "./cart.js"

/* Path for masked product images. Images follow the convention:
 
  [prefix]-[color]-[view]-[size].png
 
  Where prefix is either 'ff', 'pf', or 'cf'
  color is 'yellow', 'teal', 'purple', 'black' or 'stripe'
  view is 'a' (front) or 'b' (folded)
  and size is the image size 400, 600 or 1000
*/
(function() {
    // Don't do anything on pages other than product page
    const type = q("product-type")
    if (!type) return

    class Underwear {
        constructor() {
            this.name = q("product-name")
            this.price = q("product-price")
            this.priceText = q("product-price-text")
            this.size = q("product-size")
            this.image = q("product-image")
            this.bigImageEl = q("product-image-full")
            this.bigImage = q("product-image-full-image")
            this.quantity = q("product-quantity")
            this.color = q("product-color")
            this.defaultColor = q("product-default-color")
            this.type = q("product-type")
            this.addToCart = q("add-to-cart")
            this.cartBtn = q('cart-quantity')
            this.goToCart = q("go-to-cart")
            this.goToCartQty = q('go-to-cart-qty')
            this.cartSpinner = q('add-to-cart-spinner')
            this.productAccent = q('product-accent')
            this.stock = q('product-stock')
            this.hovered = false
            this.currentColor = this.color.value

            for (const child of this.color.children)
                if (child.value === this.defaultColor.value) {
                    child.setAttribute("selected", true)
                    this.productAccent.classList.add(`${child.value}-before`)
                    this.currentColor = child.value
                }

            // Check available inventory
            this.status = "IN_STOCK"
            this.updatePrice(Number(this.price.value) * Number(this.quantity.value))

            // Add event listeners
            this.color.addEventListener("change", () => {
                this.setImage(0)
                this.updateStatus()
                this.productAccent.classList.add(`${this.color.value}-before`)
                this.productAccent.classList.remove(`${this.currentColor}-before`)
                this.currentColor = this.color.value
            })
            this.quantity.addEventListener("blur", () =>
                numberInputHandler(
                    this.quantity,
                    (p) => this.updatePrice(p * this.item.price),
                    () => this.item.quantity
                )
            )
            this.size.addEventListener("input", () => this.updateStatus())
            this.image.addEventListener("pointerover", () => this.hover())
            this.image.addEventListener("pointerleave", () => this.hover())
            this.image.addEventListener("click", () => this.viewFull())
            this.bigImageEl.addEventListener("click", () => this.hideFull())
            this.addToCart.addEventListener("click", () => this.add())
            this.goToCart.addEventListener("click", () => location.assign("/cart"))
            state.addHook(() => this.updateStatus())
            state.addHook(() => this.updateCartBtnQty())
        }

        updateCartBtnQty() {
            let total = 0
            for (const item of state.get().cart)
                total += item.quantity
            this.goToCartQty.innerText = `${total > 0 ? `(${total})` : ''}`
        }

        get id() {
            return `${this.type.value}-${this.color.value}-${this.size.value}`
        }

        // Add a new underwear item to cart
        add() {
            if (
                this.item.quantity - Number(this.quantity.value) < 0 &&
                !this.item.quantity
            ) {
                return this
            }
            if (state.get().cart.find((item) => item.type === this.id)) {
                state.set((s) => ({
                    ...s,
                    cart: s.cart.map((i) =>
                        i.type === this.id
                            ? { ...i, quantity: i.quantity + Number(this.quantity.value) }
                            : i
                    ),
                }))
            } else {
                state.set((s) => ({
                    ...s,
                    cart: s.cart.concat({
                        ...state.get().inv.find((item) => item.type === this.id),
                        quantity: Number(this.quantity.value),
                    }),
                }))
            }
            return this
        }

        // Set the price text
        updatePrice(p) {
            this.priceText.innerText = `$${p}`
        }

        // Change pic on hover
        hover() {
            if (!this.hovered) {
                this.setImage(1)
                this.hovered = true
            } else {
                this.setImage(0)
                this.hovered = false
            }
        }

        // Show fullsize pic
        viewFull() {
            this.bigImage.src = this.item.images[2]
            this.bigImageEl.style.display = "flex"
            document.body.classList.add('hide-y')
        }

        // Hide fullsize pic
        hideFull() {
            this.bigImageEl.style.display = "none"
            document.body.classList.remove('hide-y')
        }

        // Change product image
        setImage(n) {
            if (this.item.images.length > 0) this.image.src = this.item.images[n]
            return this
        }

        // Update status depending on if inventory is available
        updateStatus() {
            if (this.item.quantity > 0) {
                this.stock.innerText = `${this.item.quantity > 5 ? 'In stock' : `Only ${this.item.quantity} left`}`
                this.stock.classList.add('in-stock')
                this.stock.classList.remove('out-stock')
                this.quantity.removeAttribute("disabled")
                this.addToCart.removeAttribute("disabled")
                this.addToCartText = "add to cart"
            } else {
                this.stock.innerText = 'None available'
                this.stock.classList.add('out-stock')
                this.stock.classList.remove('in-stock')
                this.quantity.setAttribute("disabled", true)
                this.addToCart.setAttribute("disabled", true)
                this.addToCart.innerText = "out of stock"
            }
            this.me = state.get().inv.find((item) => item.type === this.id)
            this.setImage(0)
            return this
        }

        // Return item object with quantity and price
        get item() {
            const item = state.get().inv.find((item) => item.type === this.id)
            if (item) return item
            return { price: 30, quantity: 0, images: [] }
        }
    }

    return new Underwear()
})()
