import { q, Element } from "./utils.js"

const TAX_RATE = 0.12
const ITEMS = [
    {
        id: "21839083218",
        name: "flat-front briefs",
        type: 'ff',
        image: "/assets/img/products/masked/ff-yellow-a-1920.png",
        quantity: 1,
        color: 'yellow'
    },
    {
        id: "531421",
        name: 'pouch-front briefs',
        type: 'pf',
        image: "/assets/img/products/masked/pf-teal-a-1920.png",
        quantity: 4,
        color: 'teal'
    },
    {
        id: "763896372",
        name: 'compression-front briefs',
        type: 'cf',
        image: "/assets/img/products/masked/cf-stripe-a-1920.png",
        quantity: 2,
        color: 'stripe'
    },
    {
        id: "831421890",
        name: 'pouch-front briefs',
        type: 'pf',
        image: "/assets/img/products/masked/pf-purple-a-1920.png",
        quantity: 2,
        color: 'purple'
    }
]

class Cart {
    constructor(items) {
        this.cartSubTotal = q("cart-subtotal")
        this.cartTax = q("cart-tax")
        this.cartTotal = q("cart-total")
        this.list = q("cart-products")

        this.items = items
        this.subtotal = 0
        this.render()
        this.setTotals()
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
        return this
    }
    renderItem(item) {
        const root = new DocumentFragment()
        // Image and description
        const flexCon = new Element("div", ["flex-row", "flex-grow"])
            .addChild(new Element("img", ["cart__product_image"], {
                src: item.image,
                alt: item.name,
            })).addChild(new Element(
                "div",
                ["cart__product_description"],
            ).addChild(new Element("p").addChild(item.name)))

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
        }).addChild("remove").event('click', () => this.removeItem(item.id))
        const inputs = new Element("div", ["cart__product_inputs"])
            .addChild(header)
            .addChild(quant)
            .addChild(removeBtn)

        // List
        const list = new Element("div", ["cart__product"], { id: item.id })
            .addChild(flexCon).addChild(inputs)
        root.appendChild(list.render())
        return this.list.appendChild(root)
    }

    updateQuantity(item, el, p) {
        const lessThan100 = () => {
            const v = Math.round(Number(el.value))
            return v < 100 ? v : 100
        }
        el.value = lessThan100()
        this.items = this.items.map(i => {
            if (i.id === item.id) {
                i.quantity = lessThan100()
                return i
            }
            return i
        })
        p.innerText = `$${Cart.getPrice(item.type) * lessThan100()}`
        this.setTotals()
    }

    render() {
        if (!this.list) return
        this.items.forEach(item => this.renderItem(item))
        this.setTotals()
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id != id)
        q(id).remove()
        this.setTotals()
    }

    static getPrice(type) {
        if (type === 'cf') {
            return 38
        }
        return 30
    }
}

new Cart(ITEMS)
