import { q, Element, numberInputHandler, state } from "./utils.js"

/*
    Cart performs the functions manage the shopping cart.
    Uses the 'state' object to store state in localStorage
    and updates the 'cart' nav-link upon changes.
*/

export const cart = (function() {

    const TAX_RATE = 0.12

    class Cart {
        constructor() {
            this.navLink = q('cart-link')
            this.cartSubTotal = q("cart-subtotal")
            this.cartTax = q("cart-tax")
            this.cartTotal = q("cart-total")
            this.list = q("cart-products")
            this.subtotal = 0
            this.render()
            this.setTotals()
            this.updateNavLink()
        }

        get items() {
            return state.get()
        }

        set items(items) {
            return state.update(items)
        }

        setTotals() {
            if (!this.list) return
            // Clear prices
            this.total = 0
            this.subtotal = 0
            this.tax = 0

            // Tally up
            this.items.forEach(item => {
                this.subtotal += Cart.getPrice(item.type) * item.quantity
            })
            this.tax = this.subtotal * TAX_RATE
            this.total = this.subtotal + this.tax

            // Set text
            this.cartSubTotal.innerText = `$${Number(this.total).toFixed(2)}`
            this.cartTax.innerText = `$${Number(this.total * TAX_RATE).toFixed(2)}`
            this.cartTotal.innerText = `$${Number(this.total + this.total * TAX_RATE).toFixed(2)}`

            // Update navLink
            this.updateNavLink()
            return this
        }

        renderItem(item) {
            // Image and description
            const flexCon = new Element("div", ["flex-row", "flex-grow"])
                .addChild(new Element("img", ["cart__product_image"], {
                    src: item.image,
                    alt: item.name,
                })).addChild(new Element(
                    "div",
                    ["cart__product_description"],
                ).addChild(new Element("p").addChild(`${item.name} - ${item.size}`)))

            // Inputs
            const header = new Element("h3", ["cart__product_quantity"]).addChild(
                `$${Cart.getPrice(item.type) * item.quantity}`
            )
            const quant = new Element("input", ["input", "w-4"], {
                type: "number",
                name: `${item.id}-product-quantity`,
                value: item.quantity,
                min: 0,
                max: 100,
                step: 1
            }).event('input', () => this.updateQuantity(item, quant.e, header.e))
            const removeBtn = new Element("button", ["btn", "btn__secondary"], {
                type: "button",
                id: `${item.id}-removeBtn`,
            }).addChild("remove").event('click', () => this.removeItem(item))
            const inputs = new Element("div", ["cart__product_inputs"])
                .addChild(header)
                .addChild(quant)
                .addChild(removeBtn)

            // Root of product item
            const root = new Element("div", ["cart__product"], { id: item.id })
                .addChild(flexCon).addChild(inputs)
            return root.render()
        }

        updateQuantity(item, el, p) {
            const n = numberInputHandler(el)
            this.items = this.items.map(i => {
                if (i.id === item.id) {
                    i.quantity = n
                    return i
                }
                return i
            })
            p.innerText = `$${Cart.getPrice(item.type) * n}`
            this.setTotals()
        }

        render() {
            if (!this.list) return
            const fragment = new DocumentFragment()
            this.items.forEach(item => fragment.appendChild(this.renderItem(item)))
            this.list.appendChild(fragment)
            this.setTotals()
        }

        removeItem(item) {
            this.items = this.items.filter(i => i.id != item.id)
            q(item.id).remove()
            state.remove(item)
            this.setTotals()
        }

        updateNavLink() {
            if (this.items.length) {
                this.navLink.innerText = `cart (${this.items.length})`
            } else {
                this.navLink.innerText = 'cart'
            }
        }

        static getPrice(type) {
            if (type === 'cf') {
                return 38
            }
            return 30
        }
    }

    return new Cart()
})()
