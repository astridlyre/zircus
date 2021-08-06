import { state, appendPreloadLink, withLang, ZircusElement } from '../utils.js'
import intText from '../int/intText.js'
import inStockText from './inStockText.js'
import fullImage from './fullImage.js'

/* Path for masked product images. Images follow the convention:
 
  [prefix]-[color]-[view]-[size].png
 
  Where prefix is either 'ff', 'pf', or 'cf'
  color is 'yellow', 'teal', 'purple', 'black' or 'stripe'
  view is 'a' (front) or 'b' (folded)
  and size is the image size 400, 600 or 1000
*/
export default function product() {
    inStockText()
    fullImage()
    const addToCartText = intText.product.addToCart
    const addNotificationText = intText.product.addNotificationText
    const stockText = intText.product.stockText

    class Product extends HTMLElement {
        connectedCallback() {
            this.priceText = this.querySelector('#product-price-text')
            this.sizeInput = this.querySelector('#product-size')
            this.imageElement = this.querySelector('#product-image')
            this.fullImageElement = this.querySelector('zircus-full-image')
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
            this.imageHovered = false
            this.showingFullImage = false

            const preloadImages = color =>
                ['a-400.png', 'b-400.png', 'a-1920.jpg'].forEach(image =>
                    appendPreloadLink(
                        `/assets/img/products/masked/${this._prefix}-${color}-${image}`
                    )
                )

            for (const child of this.colorInput.children) {
                preloadImages(child.value)
                if (child.value === this.defaultColor) {
                    child.setAttribute('selected', true)
                    this.productAccent.classList.add(`${child.value}-before`)
                    this.currentColor = child.value // set currentColor
                }
            }

            this.updateStatus()
            this.updateCartBtnQty()

            // Add event listeners
            this.colorInput.addEventListener('change', () => {
                this.setImage('sm_a')
                this.updateStatus()
            })

            this.quantityInput.addEventListener('input', () => {
                const max = this.currentItem.quantity
                if (Number(this.quantityInput.value) > max)
                    this.quantityInput.value = max
                this.priceText.textContent = `$${
                    Number(this.quantityInput.value) * Number(this.productPrice)
                }`
            })

            this.sizeInput.addEventListener('input', () => this.updateStatus())
            this.imageElement.addEventListener('pointerover', () =>
                this.handleHoverImage()
            )
            this.imageElement.addEventListener('pointerleave', () =>
                this.handleHoverImage()
            )
            this.imageElement.addEventListener('click', () =>
                this.fullImageElement.setAttribute(
                    'src',
                    this.currentItem.images.lg_a
                )
            )
            this.fullImageElement.addEventListener('click', () =>
                this.fullImageElement.setAttribute('src', '')
            )
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

            // Register hooks
            state.addHook({ hook: () => this.updateStatus(), key: 'inv' })
            state.addHook({ hook: () => this.updateCartBtnQty(), key: 'cart' })
        }

        get currentItem() {
            return state.inv.find(
                item =>
                    item.type ===
                    `${this._prefix}-${this.colorInput.value}-${this.sizeInput.value}`
            )
        }

        setImage(key) {
            this.currentItem &&
                (this.imageElement.src = this.currentItem.images[key])
        }

        handleHoverImage() {
            this.imageHovered = !this.imageHovered
            return this.imageHovered
                ? this.setImage('sm_b')
                : this.setImage('sm_a')
        }

        updatePrice() {
            this.priceText.textContent = `$${
                Number(this.productPrice) * Number(this.quantityInput.value)
            }`
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

        get hasEnoughQuantity() {
            return (
                this.currentItem.quantity - Number(this.quantityInput.value) >
                    0 && this.currentItem.quantity
            )
        }

        handleAddToCart() {
            if (!this.hasEnoughQuantity) return
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
            const withQuantity = obj => ({
                ...obj,
                quantity: obj.quantity + Number(this.quantityInput.value),
            })
            return (state.cart = cart =>
                cart.map(i =>
                    i.type === this.currentItem.type ? withQuantity(i) : i
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
            this.quantityInput.setAttribute('disabled', true)
            this.addToCartButton.setAttribute('disabled', true)
            this.addToCartButton.textContent = withLang(addToCartText)[0]
        }

        inStock() {
            if (this.currentItem.quantity < Number(this.quantityInput.value))
                this.quantityInput.value = this.currentItem.quantity
            this.quantityInput.removeAttribute('disabled')
            this.addToCartButton.removeAttribute('disabled')
            this.addToCartButton.textContent = withLang(addToCartText)[1]
        }

        updateStatus({ inv, currentItem } = state) {
            if (!inv) return
            if (currentItem) {
                this.sizeInput.value = currentItem.size
                this.colorInput.value = currentItem.color
                state.currentItem = null
            }
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
            if (!this.currentItem || this.currentItem.quantity === 0)
                this.outOfStock()
            else this.inStock()
            this.setImage('sm_a')
            this.updatePrice()
        }
    }

    if (!customElements.get('zircus-product'))
        customElements.define('zircus-product', Product)
}
