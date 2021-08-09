import {
    state,
    appendPreloadLinks,
    withLang,
    ZircusElement,
    setAttributes,
} from '../utils.js'
import productImage from './productImage.js'

const IMAGE_BASE_PATH = '/assets/img/products/masked/'
// Preload images
const makeLinks = (prefix, color) =>
    ['a-400.png', 'b-400.png', 'a-1920.jpg'].map(
        image => `${IMAGE_BASE_PATH}${prefix}-${color}-${image}`
    )

/* Path for masked product images. Images follow the convention:
 
  [prefix]-[color]-[view]-[size].png
 
  Where prefix is either 'ff', 'pf', or 'cf'
  color is 'yellow', 'teal', 'purple', 'black' or 'stripe'
  view is 'a' (front) or 'b' (folded)
  and size is the image size 400, 600 or 1000
*/
export default function product() {
    productImage()

    class Product extends HTMLElement {
        #prefix
        #needsUpdate = true
        #currentItem

        connectedCallback() {
            this.priceText = this.querySelector('#product-price-text')
            this.sizeInput = this.querySelector('#product-size')
            this.productImage = this.querySelector('zircus-product-image')
            this.quantityInput = this.querySelector('#product-quantity')
            this.colorInput = this.querySelector('#product-color')
            this.addToCartButton = this.querySelector('#add-to-cart')
            this.gotoCartButton = this.querySelector('#go-to-cart')
            this.gotoCartButtonText = this.querySelector('#go-to-cart-qty')
            this.productAccent = this.querySelector('#product-accent')
            this.productStatusText = this.querySelector('#product-status-text')
            this.#prefix = this.getAttribute('prefix')
            this.defaultColor = this.getAttribute('defaultcolor')
            this.currentColor = this.colorInput.value

            const colors = [...this.colorInput.children]
            appendPreloadLinks(
                colors.flatMap(color => makeLinks(this.#prefix, color.value))
            )
            const defaultColor = colors.find(
                child => child.value === this.defaultColor
            )
            if (defaultColor) {
                defaultColor.setAttribute('selected', true)
                this.productAccent.classList.add(`${defaultColor.value}-before`)
                this.currentColor = defaultColor.value // set currentColor
            }

            // Initial updates
            this.updateStatus()
                .updateCartBtnQty()
                .updateColorOptionText()
                .updateSizeOptionText()

            // Add event listeners
            this.colorInput.addEventListener('change', () => {
                this.#needsUpdate = true
                return this.updateStatus().updateSizeOptionText()
            })
            this.quantityInput.addEventListener('change', () => {
                const value = Number(this.quantityInput.value)
                this.quantityInput.value =
                    value < this.currentItem.quantity
                        ? value
                        : this.currentItem.quantity
                this.setProductPriceText()
            })
            this.quantityInput.addEventListener('blur', () => {
                const value = Number(this.quantityInput.value)
                this.quantityInput.value =
                    value <= 0
                        ? 1
                        : value < this.currentItem.quantity
                        ? value
                        : this.currentItem.quantity
                this.setProductPriceText()
            })
            this.sizeInput.addEventListener('change', () => {
                this.#needsUpdate = true
                this.updateStatus().updateColorOptionText()
            })
            this.addToCartButton.addEventListener('click', () =>
                this.handleAddToCart()
            )
            document.addEventListener('inv-updated', () => this.updateStatus())
            document.addEventListener('cart-updated', () =>
                this.updateCartBtnQty()
            )
        }

        setProductPriceText() {
            this.priceText.textContent = `$${Math.abs(
                Number(this.quantityInput.value) * this.currentItem.price
            )}`
        }

        get currentItem() {
            if (this.#needsUpdate) {
                this.#needsUpdate = false
                return (this.#currentItem = state.inv.find(
                    item =>
                        item.type ===
                        `${this.#prefix}-${this.colorInput.value}-${
                            this.sizeInput.value
                        }`
                ))
            }
            return this.#currentItem
        }

        setImage() {
            if (!this.currentItem) return
            setAttributes(this.productImage, {
                src: this.currentItem.images['sm_a'],
                hovered: this.currentItem.images['sm_b'],
                fullsrc: this.currentItem.images['lg_a'],
            })
        }

        createNotificationSuccess() {
            state.notify({
                content: [
                    new ZircusElement('img', 'notification__image', {
                        src: this.currentItem.images.sm_a,
                        alt: this.currentItem.name,
                    }).render(),
                    new ZircusElement('a', 'notification__text', {
                        href: this.getAttribute('carthref'),
                        title: this.getAttribute('carttitle'),
                    })
                        .addChild(
                            this.getAttribute('successadd').replace(
                                '|',
                                withLang(this.currentItem.name)
                            )
                        )
                        .render(),
                ],
            })
        }

        createNotificationFailure() {
            state.notify({
                content: [
                    new ZircusElement('span', ['notification__prefix', 'red'])
                        .addChild('!')
                        .render(),
                    new ZircusElement('p', ['notification__text'])
                        .addChild(this.getAttribute('erroradd'))
                        .render(),
                ],
            })
        }

        handleAddToCart() {
            const value = Number(this.quantityInput.value)
            const { type, quantity } = this.currentItem
            if (quantity - value < 0 || !quantity)
                return this.createNotificationFailure()

            const item = state.cart.find(i => i.type == type)
            const invItem = state.inv.find(i => i.type === type)

            return item
                ? item.quantity + value <= invItem.quantity
                    ? this.updateCartItem().createNotificationSuccess()
                    : this.createNotificationFailure()
                : this.addNewCartItem().createNotificationSuccess()
        }

        updateCartItem() {
            state.cart = cart =>
                cart.map(i =>
                    i.type === this.currentItem.type
                        ? {
                              ...i,
                              quantity:
                                  i.quantity + Number(this.quantityInput.value),
                          }
                        : i
                )
            return this
        }

        addNewCartItem() {
            state.cart = cart =>
                cart.concat({
                    ...this.currentItem,
                    quantity: Number(this.quantityInput.value),
                })
            return this
        }

        updateCartBtnQty() {
            const qty = state.cart.reduce((acc, item) => acc + item.quantity, 0)
            this.gotoCartButtonText.textContent = qty ? `(${qty})` : ''
            return this
        }

        outOfStock() {
            this.quantityInput.disabled = true
            this.addToCartButton.disabled = true
            this.addToCartButton.textContent =
                this.getAttribute('outstock').toLowerCase()
        }

        inStock() {
            if (this.currentItem.quantity < Number(this.quantityInput.value))
                this.quantityInput.value = this.currentItem.quantity
            this.quantityInput.disabled = false
            this.addToCartButton.disabled = false
            this.addToCartButton.textContent =
                this.getAttribute('addcarttext').toLowerCase()
        }

        updateOptionText({ input, test, alt }) {
            ;[...input.children].forEach(child => {
                child.textContent = `${
                    child.textContent.split(' - ')[0]
                } - (${alt} ${
                    state.inv.find(item => test({ item, child }))?.quantity > 0
                        ? this.getAttribute('instock').toLowerCase()
                        : this.getAttribute('outstock').toLowerCase()
                })`
            })
            return this
        }

        updateSizeOptionText() {
            return this.updateOptionText({
                input: this.sizeInput,
                alt: this.colorInput.value,
                test: ({ child, item }) =>
                    item.type ===
                    `${this.#prefix}-${this.colorInput.value}-${child.value}`,
            })
        }

        updateColorOptionText() {
            return this.updateOptionText({
                input: this.colorInput,
                alt: this.sizeInput.value,
                test: ({ child, item }) =>
                    item.type ===
                    `${this.#prefix}-${child.value}-${this.sizeInput.value}`,
            })
        }

        updateStatus({ inv, currentItem } = state) {
            if (!inv || !this.currentItem) return this
            if (currentItem) {
                this.sizeInput.value = currentItem.size
                this.colorInput.value = currentItem.color
                state.currentItem = null
            }
            this.setImage() // must be before updating currentColor
            this.productAccent.classList.replace(
                `${this.currentColor}-before`,
                `${this.colorInput.value}-before`
            )
            this.currentColor = this.colorInput.value
            this.productStatusText.textContent =
                this.currentItem.quantity <= 0
                    ? this.getAttribute('outstock')
                    : this.currentItem.quantity < 5
                    ? this.getAttribute('fewleft').replace(
                          '|',
                          this.currentItem.quantity
                      )
                    : this.getAttribute('instock')
            this.setProductPriceText()
            !this.currentItem || this.currentItem.quantity <= 0
                ? this.outOfStock()
                : this.inStock()
            return this
        }
    }

    customElements.get('zircus-product') ||
        customElements.define('zircus-product', Product)
}
