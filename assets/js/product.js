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
    const type = q("product-type")
    if (!type) return

    // const INVENTORY_URL = "http://localhost:3000/api/inv"
    const INVENTORY_URL = "https://remembrance-backbacon-09587.herokuapp.com/api/inv"

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
            this.type = q("product-type")
            this.addToCart = q("add-to-cart")
            this.checkout = q("checkout")
            this.hovered = false

            // Check available inventory
            this.status = "IN_STOCK"
            this.getInventory()
            this.updatePrice(Number(this.price.value) * Number(this.quantity.value))

            // Add event listeners
            this.color.addEventListener("change", () => {
                this.setImage(0)
                this.updateStatus()
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
            this.checkout.addEventListener("click", () => location.assign("/cart"))
        }

        get id() {
            return `${this.type.value}-${this.color.value}-${this.size.value}`
        }

        // Add a new underwear item to cart
        add() {
            state.set((s) => ({
                ...s,
                cart: s.cart.concat({
                    ...state.get().inv.find((item) => item.type === this.id),
                    quantity: Number(this.quantity.value),
                }),
            }))

            // visual feedback
            this.addToCart.classList.add("added")
            this.addToCart.innerText = "added!"
            setTimeout(() => {
                this.addToCart.classList.remove("added")
                this.addToCart.innerText = "add to cart"
            }, 1000)
            this.addToCart.blur()
            cart.updateNavLink()
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
            this.bigImage.src = this.item.images[3]
            this.bigImageEl.style.display = "flex"
        }

        // Hide fullsize pic
        hideFull() {
            this.bigImageEl.style.display = "none"
        }

        // Change product image
        setImage(n) {
            if (this.item.images.length > 0)
                this.image.src = this.item.images[n]
            return this
        }

        // Update status depending on if inventory is available
        updateStatus() {
            if (this.item.quantity > 0) {
                this.quantity.removeAttribute("disabled")
                this.addToCart.removeAttribute("disabled")
                this.addToCart.innerText = "add to cart"
            } else {
                this.quantity.setAttribute("disabled", true)
                this.addToCart.setAttribute("disabled", true)
                this.addToCart.innerText = "out of stock"
            }
            this.me = state.get().inv.find(item => item.type === this.id)
            this.setImage(0)
            return this
        }

        // Return item object with quantity and price
        get item() {
            const item = state.get().inv.find((item) => item.type === this.id)
            if (item) return item
            return { price: 30, quantity: 0, images: [] }
        }

        // Get Inventory to set max quantities of items
        async getInventory() {
            return await fetch(INVENTORY_URL)
                .then((data) => data.json())
                .then((data) => {
                    state.set((state) => ({
                        ...state,
                        inv: data,
                    }))
                    // update quantities
                    this.updateStatus()
                })
                .catch((_) => {
                    console.error("Unable to get inventory")
                    this.updateStatus()
                })
        }
    }

    return new Underwear()
})()
