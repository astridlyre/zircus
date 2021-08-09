import { withLang, lang, state, q, ZircusElement } from '../utils.js'
import intText from '../int/intText.js'

export default function cartProduct() {
    const { removeBtnText, removeNotificationText } = intText.cart
    class CartProduct extends HTMLElement {
        #item

        connectedCallback() {
            this.classList.add('cart__product')
            const template = q('zircus-product-template').content.cloneNode(
                true
            )
            const link = template.querySelector('a')
            const img = template.querySelector('img')
            const desc = template.querySelector('p')
            const price = template.querySelector('span')
            const qty = template.querySelector('.input')
            const label = template.querySelector('label')
            const removeBtn = template.querySelector('button')
            const inputs = template.querySelector('.hidden')

            const name = withLang(this.item.name)
            const l = lang()

            link.href = `/products/${this.item.name.en
                .toLowerCase()
                .split(' ')
                .join('-')}${l !== 'en' ? `-${l}` : ''}.html`
            link.addEventListener(
                'click',
                () =>
                    (state.currentItem = {
                        type: this.item.type,
                        color: this.item.color,
                        size: this.item.size,
                    })
            )
            link.setAttribute('title', name)
            img.src = this.item.images.sm_a
            img.alt = `${name} ${this.item.size} ${this.item.color} underwear`

            if (this.getAttribute('withactions')) {
                inputs.classList.remove('hidden')
                desc.textContent = `${name} (${this.item.size})`
                price.textContent = `$${this.item.price * this.item.quantity}`
                qty.value = this.item.quantity
                qty.id = this.item.type
                qty.setAttribute(
                    'name',
                    `${name} ${this.item.size} ${this.item.color}`
                )
                label.setAttribute('for', this.item.type)
                qty.addEventListener('input', () => {
                    if (!qty.value) qty.value = 1
                    const max = state.inv.find(
                        i => i.type === this.item.type
                    ).quantity
                    if (Number(qty.value) > max) qty.value = max
                    state.cart = cart =>
                        cart.map(i =>
                            i.id === this.item.id
                                ? { ...i, quantity: Number(qty.value) }
                                : i
                        )
                    price.textContent = `$${
                        this.item.price * Number(qty.value)
                    }`
                    removeBtn.setAttribute(
                        'title',
                        withLang(
                            removeBtnText({
                                ...this.item,
                                quantity: Number(qty.value),
                            })
                        )
                    )
                    this.dispatchEvent(new CustomEvent('update-totals'))
                })

                // Add remove button functionality
                removeBtn.setAttribute(
                    'title',
                    withLang(removeBtnText(this.item))
                )
                removeBtn.setAttribute(
                    'aria-label',
                    withLang(removeBtnText(this.item))
                )
                removeBtn.addEventListener('click', () => {
                    state.cart = cart => cart.filter(i => i.id !== this.item.id)
                    this.dispatchEvent(new CustomEvent('update-totals'))
                    state.notify(this.createNotification(link.href))
                    !state.cart.length &&
                        this.dispatchEvent(new CustomEvent('render'))
                    this.remove()
                })
            } else {
                desc.textContent = `${name} (${this.item.size}) x ${this.item.quantity}`
            }
            this.appendChild(template)
        }

        createNotification(href) {
            const img = new ZircusElement('img', 'notification__image', {
                src: this.item.images.sm_a,
                alt: withLang(this.item.name),
            })
            const a = new ZircusElement('a', 'notification__text', {
                href,
                title: withLang({
                    en: 'Go to product page',
                    fr: 'Aller au page du produit',
                }),
            }).addChild(withLang(removeNotificationText(this.item)))

            const link = new ZircusElement('zircus-router-link').addChild(a)

            return {
                content: [img.render(), link.render()],
                color: 'gray',
            }
        }

        set item(item) {
            this.#item = item
        }

        get item() {
            return this.#item
        }
    }

    customElements.get('zircus-cart-product') ||
        customElements.define('zircus-cart-product', CartProduct)
}
