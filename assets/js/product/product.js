import {
    q,
    state,
    appendPreloadLink,
    withLang,
    switchClass,
    ZircusElement,
} from '../utils.js'
import intText from '../int/intText.js'

/* Path for masked product images. Images follow the convention:
 
  [prefix]-[color]-[view]-[size].png
 
  Where prefix is either 'ff', 'pf', or 'cf'
  color is 'yellow', 'teal', 'purple', 'black' or 'stripe'
  view is 'a' (front) or 'b' (folded)
  and size is the image size 400, 600 or 1000
*/
export default function product() {
    const addToCartText = intText.product.addToCart
    const addNotificationText = intText.product.addNotificationText
    const stockText = intText.product.stockText

    class Product extends HTMLElement {
        connectedCallback() {
            this.priceText = this.querySelector('#product-price-text')
            this.sizeInput = this.querySelector('#product-size')
            this.imageElement = this.querySelector('#product-image')
            this.fullImageContainer = this.querySelector('#product-image-full')
            this.fullImageElement = this.querySelector(
                '#product-image-full-image'
            )
            this.quantityInput = this.querySelector('#product-quantity')
            this.colorInput = this.querySelector('#product-color')
            this.addToCartButton = this.querySelector('#add-to-cart')
            this.goToCartButton = this.querySelector('#go-to-cart')
            this.goToCartButtonText = this.querySelector('#go-to-cart-qty')
            this.productAccent = this.querySelector('#product-accent')
            this.stockStatusText = this.querySelector('#product-stock')

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
                if (child.value === this.defaultColor.value) {
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
                this.handleShowFullImage()
            )
            this.fullImageContainer.addEventListener('click', () =>
                this.handleShowFullImage()
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
            this.imageElement.src = this.currentItem.images[key]
        }

        handleHoverImage() {
            this.imageHovered = !this.imageHovered
            return this.imageHovered
                ? this.setImage('sm_b')
                : this.setImage('sm_a')
        }

        showFullImage() {
            this.fullImageElement.src = this.currentItem.images['lg_a']
            this.fullImageContainer.style.display = 'flex'
            q('nav').classList.add('hidden')
            q('menu-mobile-btn').classList.add('hidden')
            document.body.classList.add('hide-y')
        }

        hideFullImage() {
            this.fullImageContainer.style.display = 'none'
            q('nav').classList.remove('hidden')
            q('menu-mobile-btn').classList.remove('hidden')
            document.body.classList.remove('hide-y')
        }

        handleShowFullImage() {
            this.showingFullImage = !this.showingFullImage
            return this.showingFullImage
                ? this.showFullImage()
                : this.hideFullImage()
        }

        updatePrice() {
            this.priceText.textContent = `$${
                Number(this.productPrice) * Number(this.quantityInput.value)
            }`
        }

        createNotification() {
            const img = new ZircusElement('img', 'notification__image', {
                src: this.currentItem.images.sm_a,
                alt: this.currentItem.name,
            })
            const p = new ZircusElement('p').addChild(
                withLang(addNotificationText(this.currentItem))
            )
            const onClick = () =>
                location.assign(withLang({ en: '/cart', fr: '/fr/panier' }))
            return {
                content: [img.render(), p.render()],
                onClick,
                color: 'green',
            }
        }

        handleAddToCart() {
            if (
                this.currentItem.quantity - Number(this.quantityInput.value) <
                    0 ||
                !this.currentItem.quantity
            )
                return

            if (state.cart.find(i => i.type === this.currentItem.type))
                this.updateCartItem()
            else this.addNewCartItem()

            state.notify(this.createNotification())
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
            this.stockStatusText.textContent = withLang(stockText(0))[0]
            switchClass(this.stockStatusText, 'in-stock', 'out-stock')
            this.quantityInput.setAttribute('disabled', true)
            this.addToCartButton.setAttribute('disabled', true)
            this.addToCartButton.textContent = withLang(addToCartText)[0]
        }

        inStock() {
            const text = withLang(stockText(this.currentItem.quantity))
            this.stockStatusText.innerText = `${
                this.currentItem.quantity > 5 ? text[2] : text[1]
            }`
            if (this.currentItem.quantity < Number(this.quantityInput.value))
                this.quantityInput.value = this.currentItem.quantity
            switchClass(this.stockStatusText, 'out-stock', 'in-stock')
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
            switchClass(
                this.productAccent,
                `${this.currentColor}-before`,
                `${this.colorInput.value}-before`
            )
            this.currentColor = this.colorInput.value
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
