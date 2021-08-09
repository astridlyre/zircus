import {
    state,
    appendPreloadLink,
    withLang,
    ZircusElement,
    setAttributes,
} from '../utils.js'
import intText from '../int/intText.js'
import inStockText from './inStockText.js'
import productImage from './productImage.js'

const IMAGE_BASE_PATH = '/assets/img/products/masked/'
// Preload images
const preloadImages = ({ prefix, color }) =>
    ['a-400.png', 'b-400.png', 'a-1920.jpg'].forEach(image =>
        appendPreloadLink(`${IMAGE_BASE_PATH}${prefix}-${color}-${image}`)
    )

/* Path for masked product images. Images follow the convention:
 
  [prefix]-[color]-[view]-[size].png
 
  Where prefix is either 'ff', 'pf', or 'cf'
  color is 'yellow', 'teal', 'purple', 'black' or 'stripe'
  view is 'a' (front) or 'b' (folded)
  and size is the image size 400, 600 or 1000
*/
export default function product() {
    inStockText()
    productImage()
    const addToCartText = intText.product.addToCart
    const addNotificationText = intText.product.addNotificationText

    class Product extends HTMLElement {
        #prefix

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
            this.stockStatusText = this.querySelector('zircus-in-stock-text')
            this.#prefix = this.getAttribute('prefix')
            this.defaultColor = this.getAttribute('defaultcolor')
            this.currentColor = this.colorInput.value
            ;[...this.colorInput.children].forEach(child => {
                preloadImages({ color: child.value, prefix: this.#prefix })
                if (child.value === this.defaultColor) {
                    child.setAttribute('selected', true)
                    this.productAccent.classList.add(`${child.value}-before`)
                    this.currentColor = child.value // set currentColor
                }
            })

            // Initial updates
            this.updateStatus()
                .updateCartBtnQty()
                .updateColorOptionText()
                .updateSizeOptionText()

            // Add event listeners
            this.colorInput.addEventListener('change', () =>
                this.updateStatus().updateSizeOptionText()
            )
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
            this.sizeInput.addEventListener('input', () =>
                this.updateStatus().updateColorOptionText()
            )
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
            return state.inv.find(
                item =>
                    item.type ===
                    `${this.#prefix}-${this.colorInput.value}-${
                        this.sizeInput.value
                    }`
            )
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
                        href: withLang({ en: '/cart', fr: '/fr/panier' }),
                        title: withLang({
                            en: 'Go to cart',
                            fr: 'Aller au panier',
                        }),
                    })
                        .addChild(
                            withLang(addNotificationText(this.currentItem))
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
                        .addChild(
                            withLang({
                                en: 'Unable to add to cart - not enough stock',
                                fr: "Impossible d'ajouter au panier, pas assez de stock",
                            })
                        )
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
            this.addToCartButton.textContent = withLang(addToCartText)[0]
        }

        inStock() {
            if (this.currentItem.quantity < Number(this.quantityInput.value))
                this.quantityInput.value = this.currentItem.quantity
            this.quantityInput.disabled = false
            this.addToCartButton.disabled = false
            this.addToCartButton.textContent = withLang(addToCartText)[1]
        }

        updateOptionText({ input, test, alt }) {
            ;[...input.children].forEach(child => {
                child.textContent = `${
                    child.textContent.split(' - ')[0]
                } - (${alt} ${
                    state.inv.find(item => test({ item, child })).quantity > 0
                        ? withLang({ en: 'in stock', fr: 'en stock' })
                        : withLang({ en: 'out of stock', fr: 'pas disponible' })
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
            if (!inv || !this.currentItem) return
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
            this.stockStatusText.quantity = this.currentItem.quantity
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
