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

    const INVENTORY_URL = "http://localhost:3000/prices"
    const IMAGE_PATH = "/assets/img/products/masked/"
    const VIEWS = ["a", "b"]
    const COLORS = ["yellow", "purple", "teal", "black", "stripe"]

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
            this.images = {}
            this.hovered = false

            // Check available inventory
            this.status = "IN_STOCK"
            this.quantities = []
            this.getInventory()
            this.updatePrice(Number(this.price.value) * Number(this.quantity.value))

            // Initialize the images
            for (const color of COLORS) {
                const arr = []
                for (const view of VIEWS) {
                    arr.push(`${IMAGE_PATH}${this.type.value}-${color}-${view}-1920.png`)
                }
                this.images[color] = arr
            }

            // Add event listeners
            this.color.addEventListener("change", () => {
                this.setImage(0)
                this.updateStatus()
            })
            this.quantity.addEventListener("blur", () =>
                numberInputHandler(this.quantity, (p) =>
                    this.updatePrice(p * this.getPrice()),
                    () => this.inventory.quantity)
            )
            this.size.addEventListener("input", () => this.updateStatus())
            this.image.addEventListener("pointerover", () => this.hover())
            this.image.addEventListener("pointerleave", () => this.hover())
            this.image.addEventListener("click", () => this.viewFull())
            this.bigImageEl.addEventListener("click", () => this.hideFull())
            this.addToCart.addEventListener("click", () => this.add())
            this.checkout.addEventListener("click", () => location.assign("/cart"))
            this.setImage(0)
        }

        get id() {
            return `${this.type.value}-${this.color.value}-${this.size.value}`
        }

        // Add a new underwear item to cart
        add() {
            state.set((state) => ({
                ...state,
                items: state.items.concat({
                    id: `${this.type.value}-${this.color.value}-${this.size.value}`,
                    name: this.name.innerText,
                    color: this.color.value,
                    image: this.images[this.color.value][0],
                    size: this.size.value,
                    quantity: Number(this.quantity.value),
                    type: this.type.value,
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

        // Hard-coded for now
        getPrice() {
            return this.inventory.price
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
            this.bigImage.src = this.images[this.color.value][0]
            this.bigImageEl.style.display = "flex"
        }

        // Hide fullsize pic
        hideFull() {
            this.bigImageEl.style.display = "none"
        }

        // Change product image
        setImage(n) {
            this.image.src = this.images[this.color.value][n]
            return this
        }

        // Update status depending on if inventory is available
        updateStatus() {
            if (this.inventory.quantity > 0) {
                this.quantity.removeAttribute("disabled")
                this.addToCart.removeAttribute("disabled")
                this.addToCart.innerText = "add to cart"
            } else {
                this.quantity.setAttribute("disabled", true)
                this.addToCart.setAttribute("disabled", true)
                this.addToCart.innerText = "out of stock"
            }
            return this
        }

        // Return item object with quantity and price
        get inventory() {
            const item = this.quantities.find((item) => item.id === this.id)
            if (item) return item
            return { price: 30, quantity: 0 }
        }

        // Get Inventory to set max quantities of items
        async getInventory() {
            return await fetch(INVENTORY_URL)
                .then((data) => data.json())
                .then((data) => {
                    state.set((state) => ({
                        ...state,
                        maxQuantities: data,
                    }))
                    // update quantities
                    this.quantities = state.get().maxQuantities
                    this.updateStatus()
                })
                .catch((_) => {
                    state.set(state => ({
                        ...state,
                        maxQuantities: [{ id: 'ff-yellow-sm', price: 30, quantity: 3 }]
                    }))
                    this.quantities = state.get().maxQuantities
                    this.updateStatus()
                })
        }
    }

    return new Underwear()
})()
