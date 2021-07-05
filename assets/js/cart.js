import { q, Element, API_ENDPOINT, numberInputHandler, state } from "./utils.js"

/*
    Cart performs the functions manage the shopping cart.
    Uses the 'state' object to store state in localStorage
    and updates the 'cart' nav-link upon changes.
*/

export const cart = (function() {
    const TAX_RATE = 0.12

    class Cart {
        constructor() {
            this.cartSubTotal = q("cart-subtotal")
            this.cartTax = q("cart-tax")
            this.cartTotal = q("cart-total")
            this.list = q("cart-products")
            this.checkoutList = q("checkout-products")
            this.checkoutBtn = q("cart-checkout")
            this.payPalBtn = q("cart-paypal")
            this.placeOrderBtn = q("place-order")
            this.country = q("checkout-country")
            this.state = q("checkout-state")
            this.city = q("checkout-city")
            this.subtotal = 0
            this.render().setTotals()

            this.checkoutBtn &&
                this.checkoutBtn.addEventListener("click", () => {
                    if (this.items.length > 0) location.assign("/checkout")
                })

        }

        get items() {
            return state.get().cart
        }

        enableButtons() {
            if (this.items.length > 0) {
                this.checkoutBtn.removeAttribute("disabled")
            } else {
                this.checkoutBtn.setAttribute("disabled", true)
            }
        }

        setTotals() {
            if (!this.list && !this.checkoutList) return this
            // Clear prices
            this.total = 0
            this.subtotal = 0
            this.tax = 0

            // Tally up
            this.items.forEach((item) => {
                this.subtotal += item.price * item.quantity
            })
            this.tax = this.subtotal * TAX_RATE
            this.total = this.subtotal + this.tax

            // Set text
            this.cartSubTotal.innerText = `$${Number(this.total).toFixed(2)}`
            this.cartTax.innerText = `$${Number(this.total * TAX_RATE).toFixed(2)}`
            this.cartTotal.innerText = `$${Number(
                this.total + this.total * TAX_RATE
            ).toFixed(2)}`

            // Update navLink
            this.list && this.enableButtons()
            return this
        }

        // Hard coded for now
        getItemType(item) {
            return item.name.toLowerCase().split(" ").join("-")
        }

        renderItem(item, renderMinimal) {
            if (!renderMinimal) {
                // Image and description
                const flexCon = new Element("a", ["cart__product_flexcon"], {
                    href: `/products/${this.getItemType(item)}.html`,
                })
                    .addChild(
                        new Element("img", ["cart__product_image"], {
                            src: item.images['sm_a'],
                            alt: item.name,
                        })
                    )
                    .addChild(
                        new Element("div", ["cart__product_description"]).addChild(
                            new Element("p").addChild(`${item.name} - ${item.size}`)
                        )
                    )
                // Inputs
                const header = new Element("h3", ["cart__product_quantity"]).addChild(
                    `$${item.price * item.quantity}`
                )

                const quant = new Element("input", ["input", "w-4"], {
                    type: "number",
                    name: `${item.id}-product-quantity`,
                    value: item.quantity,
                    min: 0,
                    max: 100,
                    step: 1,
                }).event("blur", () => this.updateQuantity(item, quant.e, header.e))

                const removeBtn = new Element("button", ["btn", "btn__secondary"], {
                    type: "button",
                    id: `${item.id}-removeBtn`,
                })
                    .addChild("remove")
                    .event("click", () => this.removeItem(item))

                const inputs = new Element("div", ["cart__product_inputs"])
                    .addChild(header)
                    .addChild(quant)
                    .addChild(removeBtn)

                // Root of product item
                const root = new Element("div", ["cart__product"], { id: item.id })
                    .addChild(flexCon)
                    .addChild(inputs)

                return root.render()
            } else {
                // Image and description
                const flexCon = new Element("a", ["cart__product_flexcon"], {
                    href: `/products/${this.getItemType(item)}.html`,
                })
                    .addChild(
                        new Element("img", ["cart__product_image"], {
                            src: item.images['sm_a'],
                            alt: item.name,
                        })
                    )
                    .addChild(
                        new Element("div", ["cart__product_description"]).addChild(
                            new Element("p").addChild(
                                `${item.name} - ${item.size} - ${item.quantity}`
                            )
                        )
                    )

                // Root of product item
                const root = new Element("div", ["cart__product"], {
                    id: item.id,
                }).addChild(flexCon)

                return root.render()
            }
        }

        updateQuantity(item, el, p) {
            const n = numberInputHandler(
                el,
                null,
                () => state.get().inv.find((i) => i.id === item.id).quantity
            )
            state.set((state) => ({
                ...state,
                cart: state.cart.map((i) => {
                    return i.id === item.id ? { ...i, quantity: n } : i
                }),
            }))
            p.innerText = `$${item.price * n}`
            return this.setTotals()
        }

        render() {
            if (!this.list && !this.checkoutList) return this
            if (!this.items.length && !this.checkoutList) {
                this.list.appendChild(
                    new Element("p", ["cart__empty"])
                        .addChild("No items in cart")
                        .render()
                )
                return this
            } else {
                const fragment = new DocumentFragment()
                this.items.forEach((item) => {
                    fragment.appendChild(
                        this.renderItem(item, this.checkoutList ? true : false)
                    )
                })

                if (this.list) this.list.appendChild(fragment)
                else this.checkoutList.appendChild(fragment)
                return this.setTotals()
            }
        }

        removeItem(item) {
            state.set((state) => ({
                ...state,
                cart: state.cart.filter((i) => i.id != item.id),
            }))
            q(item.id).remove()
            if (!this.items.length) return this.render().setTotals()
            return this.setTotals()
        }
    }

    return new Cart()
})()
