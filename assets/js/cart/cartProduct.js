import {
    withLang,
    lang,
    state,
    ZircusElement,
    setAttributes,
} from '../utils.js'
import intText from '../int/intText.js'

export default function cartProduct() {
    const { removeBtnText, removeNotificationText } = intText.cart
    class CartProduct extends HTMLElement {
        #item
        #template
        #link
        #image
        #description
        #price
        #quantity
        #label
        #removeButton
        #actionsContainer

        connectedCallback() {
            this.#template = document
                .getElementById('zircus-product-template')
                .content.cloneNode(true)
            this.#link = this.#template.querySelector('a')
            this.#image = this.#template.querySelector('img')
            this.#description = this.#template.querySelector('p')
            this.#price = this.#template.querySelector('span')
            this.#quantity = this.#template.querySelector('.input')
            this.#label = this.#template.querySelector('label')
            this.#removeButton = this.#template.querySelector('button')
            this.#actionsContainer = this.#template.querySelector('.hidden')
            this.classList.add('cart__product')

            // Set atttributes
            setAttributes(this.#link, {
                href: this.createLinkHref(this.item),
                title: this.name,
            })
            setAttributes(this.#image, {
                src: this.item.images.sm_a,
                alt: `${this.name} ${this.item.size} ${this.item.color} underwear`,
            })

            // Add link click event
            this.#link.addEventListener(
                'click',
                () =>
                    (state.currentItem = {
                        type: this.item.type,
                        color: this.item.color,
                        size: this.item.size,
                    })
            )

            // If no actions, we're done
            if (!this.getAttribute('withactions')) {
                this.#description.textContent = `${this.name} (${this.item.size}) x ${this.item.quantity}`
                return this.appendChild(this.#template)
            }

            this.#description.textContent = `${this.name} (${this.item.size})`
            this.#price.textContent = `$${this.item.price * this.item.quantity}`

            setAttributes(this.#quantity, {
                value: this.item.quantity,
                id: this.item.type,
                name: `${this.name} ${this.item.size} ${this.item.color}`,
            })

            this.#label.setAttribute('for', this.item.type)

            this.#quantity.addEventListener('input', () => {
                this.#quantity.value = Math.max(
                    Math.min(
                        state.inv.find(i => i.type === this.item.type).quantity,
                        this.quantity
                    ),
                    1
                )
                state.cart = cart =>
                    cart.map(i =>
                        i.id === this.item.id
                            ? { ...i, quantity: this.quantity }
                            : i
                    )
                this.#price.textContent = `$${this.item.price * this.quantity}`
                this.#removeButton.setAttribute(
                    'title',
                    withLang(
                        removeBtnText({
                            ...this.item,
                            quantity: this.quantity,
                        })
                    )
                )
                this.dispatchEvent(new CustomEvent('update-totals'))
            })

            // Add remove button functionality
            setAttributes(this.#removeButton, {
                title: withLang(removeBtnText(this.item)),
                'aria-label': withLang(removeBtnText(this.item)),
            })
            this.#removeButton.addEventListener('click', () => {
                state.cart = cart => cart.filter(i => i.id !== this.item.id)
                state.notify(this.createNotification(this.#link.href))
                this.dispatchEvent(new CustomEvent('update-totals'))
                !state.cart.length &&
                    this.dispatchEvent(new CustomEvent('render'))
                this.remove()
            })
            this.appendChild(this.#template)
        }

        get name() {
            return withLang(this.item.name)
        }

        get quantity() {
            return Number(this.#quantity.value)
        }

        createLinkHref(item) {
            return `/products/${item.name.en
                .toLowerCase()
                .split(' ')
                .join('-')}${lang() !== 'en' ? `-${lang()}` : ''}.html`
        }

        createNotification(href) {
            return {
                content: [
                    new ZircusElement('img', 'notification__image', {
                        src: this.item.images.sm_a,
                        alt: this.name,
                    }).render(),
                    new ZircusElement('zircus-router-link')
                        .addChild(
                            new ZircusElement('a', 'notification__text', {
                                href,
                                title: withLang({
                                    en: 'Go to product page',
                                    fr: 'Aller au page du produit',
                                }),
                            }).addChild(
                                withLang(removeNotificationText(this.item))
                            )
                        )
                        .render(),
                ],
                color: 'gray',
            }
        }

        set item(item) {
            this.#item = item
            return this
        }

        get item() {
            return this.#item
        }
    }

    customElements.get('zircus-cart-product') ||
        customElements.define('zircus-cart-product', CartProduct)
}
