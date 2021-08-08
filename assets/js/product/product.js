import { state, appendPreloadLink, withLang, ZircusElement } from '../utils.js'
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
    const stockText = intText.product.stockText

    class Product extends HTMLElement {
        connectedCallback() {
            this.priceText = this.querySelector('#product-price-text')
            this.sizeInput = this.querySelector('#product-size')
            this.imageElement = this.querySelector('zircus-product-image')
            this.quantityInput = this.querySelector('#product-quantity')
            this.colorInput = this.querySelector('#product-color')
            this.addToCartButton = this.querySelector('#add-to-cart')
            this.goToCartButton = this.querySelector('#go-to-cart')
            this.goToCartButtonText = this.querySelector('#go-to-cart-qty')
            this.productAccent = this.querySelector('#product-accent')
            this.stockStatusText = this.querySelector('zircus-in-stock-text')

            this.productPrice = this.getAttribute('price')
            this._prefix = this.getAttribute('prefix')
            this.defaultColor = this.getAttribute('defaultcolor')

            this.currentColor = this.colorInput.value
            this.item = this.currentItem

            for (const child of this.colorInput.children) {
                preloadImages({ color: child.value, prefix: this._prefix })
                if (child.value === this.defaultColor) {
                    child.setAttribute('selected', true)
                    this.productAccent.classList.add(`${child.value}-before`)
                    this.currentColor = child.value // set currentColor
                }
            }

            // Initial updates
            this.updateStatus()
            this.updateCartBtnQty()
            this.updateColorOptionText()
            this.updateSizeOptionText()

            // Add event listeners
            this.colorInput.addEventListener('change', () => {
                this.updateStatus()
                this.updateSizeOptionText()
            })

            this.quantityInput.addEventListener('input', event => {
                const value = Number(event.target.value)
                if (value > this.currentItem.quantity)
                    this.quantityInput.value = this.currentItem.quantity
                this.setProductPriceText()
            })

            this.quantityInput.addEventListener('blur', event => {
                const value = Number(event.target.value)
                if (value > this.currentItem.quantity)
                    this.quantityInput.value = this.currentItem.quantity
                if (value <= 0) this.quantityInput.value = 1
                this.setProductPriceText()
            })

            this.sizeInput.addEventListener('input', () => {
                this.updateStatus()
                this.updateColorOptionText()
            })
            this.addToCartButton.addEventListener('click', () =>
                this.handleAddToCart()
            )
            this.goToCartButton.addEventListener('click', () =>
                location.assign(
                    withLang({
                        en: '/cart',
                        fr: '/fr/panier',
                    })
                )
            )

            document.addEventListener('inv-updated', () => this.updateStatus())
            document.addEventListener('cart-updated', () =>
                this.updateCartBtnQty()
            )
        }

        setProductPriceText() {
            this.priceText.textContent = `$${Math.abs(
                Number(this.quantityInput.value) * Number(this.productPrice)
            )}`
        }

        get currentItem() {
            return state.inv.find(
                item =>
                    item.type ===
                    `${this._prefix}-${this.colorInput.value}-${this.sizeInput.value}`
            )
        }

        setImage() {
            if (!this.currentItem) return
            this.imageElement.setAttribute(
                'src',
                this.currentItem.images['sm_a']
            )
            this.imageElement.setAttribute(
                'hovered',
                this.currentItem.images['sm_b']
            )
            this.imageElement.setAttribute(
                'fullsrc',
                this.currentItem.images['lg_a']
            )
        }

        createNotificationSuccess() {
            return {
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
            }
        }

        createNotificationFailure() {
            return {
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
            }
        }

        handleAddToCart() {
            if (
                this.currentItem.quantity - Number(this.quantityInput.value) <
                    0 ||
                !this.currentItem.quantity
            )
                return state.notify(this.createNotificationFailure())
            const item = state.cart.find(i => i.type == this.currentItem.type)
            const invItem = state.inv.find(
                i => i.type === this.currentItem.type
            )
            if (item) {
                if (
                    item.quantity + Number(this.quantityInput.value) <=
                    invItem.quantity
                )
                    this.updateCartItem()
                else return state.notify(this.createNotificationFailure())
            } else this.addNewCartItem()

            state.notify(this.createNotificationSuccess())
            this.addToCartButton.blur()
        }

        updateCartItem() {
            return (state.cart = cart =>
                cart.map(i =>
                    i.type === this.currentItem.type
                        ? {
                              ...i,
                              quantity:
                                  i.quantity + Number(this.quantityInput.value),
                          }
                        : i
                ))
        }

        addNewCartItem() {
            return (state.cart = cart =>
                cart.concat({
                    ...this.currentItem,
                    quantity: Number(this.quantityInput.value),
                }))
        }

        updateCartBtnQty() {
            const totalItems = state.cart.reduce(
                (acc, item) => acc + item.quantity,
                0
            )
            this.goToCartButtonText.textContent = `${
                totalItems > 0 ? `(${totalItems})` : ''
            }`
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
            for (const child of input.children) {
                const item = state.inv.find(item => test({ item, child }))
                const [text] = child.textContent.split(' - ')
                child.textContent = `${text} - (${alt} ${
                    item.quantity > 0
                        ? withLang({ en: 'in stock', fr: 'en stock' })
                        : withLang({ en: 'out of stock', fr: 'pas disponible' })
                })`
            }
        }

        updateSizeOptionText() {
            return this.updateOptionText({
                input: this.sizeInput,
                alt: this.colorInput.value,
                test: ({ child, item }) =>
                    item.type ===
                    `${this._prefix}-${this.colorInput.value}-${child.value}`,
            })
        }

        updateColorOptionText() {
            return this.updateOptionText({
                input: this.colorInput,
                alt: this.sizeInput.value,
                test: ({ child, item }) =>
                    item.type ===
                    `${this._prefix}-${child.value}-${this.sizeInput.value}`,
            })
        }

        updateStatus({ inv, currentItem } = state) {
            if (!inv) return
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
            this.stockStatusText.setAttribute(
                'quantity',
                this.currentItem?.quantity
            )
            this.stockStatusText.setAttribute(
                'text',
                withLang(stockText(this.currentItem?.quantity))
            )
            if (!this.currentItem || this.currentItem.quantity <= 0)
                this.outOfStock()
            else this.inStock()
            this.setProductPriceText()
        }
    }

    customElements.get('zircus-product') ||
        customElements.define('zircus-product', Product)
}
