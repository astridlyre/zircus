import { state, ZircusElement, calculateTax, withLang } from '../utils.js'
import intText from '../int/intText.js'
import checkoutForm from './form.js'
import initStripe from './stripe.js'
import initPaypal from './paypal.js'
import shippingInputs from './shippingInputs.js'
import shippingTypes from './shippingTypes.js'

const CANADA_POSTAL_CODE = /^[A-Za-z][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]$/
const US_ZIP_CODE = /^[0-9]{5}(-[0-9]{4})?$/

export default function payment() {
    const { formText } = intText.checkout
    shippingInputs({ shippingTypes })
    checkoutForm()
    initStripe()
    initPaypal()

    class Payment extends HTMLElement {
        #formState
        #formStateLabel
        #formCountry
        #formPostalCode
        #formPostalCodeLabel
        #checkoutSubtotal
        #checkoutTotal
        #checkoutTax
        #checkoutShipping
        #shippingInputs
        #productList
        #stripe

        connectedCallback() {
            if (!state.cart.length) {
                return state.showModal({
                    content: withLang(intText.checkout.modalText).content,
                    heading: withLang(intText.checkout.modalText).heading,
                    ok: {
                        text: withLang(intText.checkout.modalText).okText,
                        title: withLang(intText.checkout.modalText).okTitle,
                        action: ({ close }) => {
                            close()
                            document.querySelector('zircus-router').page =
                                withLang({ en: '/shop', fr: '/fr/boutique' })
                        },
                    },
                })
            }
            this.#formState = this.querySelector('#checkout-state')
            this.#formStateLabel = this.querySelector('#checkout-state-text')
            this.#formCountry = this.querySelector('#checkout-country')
            this.#formPostalCode = this.querySelector('#checkout-postal-code')
            this.#formPostalCodeLabel = this.querySelector(
                '#checkout-postal-code-text'
            )
            this.#checkoutSubtotal = this.querySelector('#checkout-subtotal')
            this.#checkoutTax = this.querySelector('#checkout-tax')
            this.#checkoutTotal = this.querySelector('#checkout-total')
            this.#checkoutShipping = this.querySelector('#checkout-shipping')
            this.#shippingInputs = this.querySelector('zircus-shipping-inputs')
            this.#productList = this.querySelector('#checkout-products')

            const attrs = {
                heading: this.getAttribute('heading'),
                buttontext: this.getAttribute('buttontext'),
                canceltext: this.getAttribute('canceltext'),
                id: 'stripe-payment-modal',
                success: this.getAttribute('success'),
                failure: this.getAttribute('failure'),
                complete: this.getAttribute('complete'),
            }

            this.#stripe = new ZircusElement(
                'zircus-stripe',
                'stripe-payment-form',
                attrs
            ).render()

            this.appendChild(this.#stripe)

            // Render Items
            this.renderCartItems()
            this.handleCountry()

            // Add event listeners
            this.#formCountry.addEventListener('input', () =>
                this.handleCountry()
            )
            this.#formState.addEventListener('input', () => this.setTotals())
            this.#formPostalCode.addEventListener('input', event => {
                this.#formPostalCode.value = this.handlePostalCode(
                    event.target.value,
                    this.#formCountry.value
                )
            })

            this.#shippingInputs.addEventListener('method-changed', () =>
                this.setTotals()
            )
            this.#shippingInputs.addEventListener('mounted', () =>
                this.setTotals()
            )
        }

        setTotals() {
            requestAnimationFrame(() => {
                const shipping = Number(
                    shippingTypes[this.#shippingInputs.value]?.price
                )
                const subtotal = state.cart.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                )
                const tax =
                    (subtotal + shipping) *
                    calculateTax(this.#formCountry.value, this.#formState.value)
                const total = subtotal + shipping + tax

                // Set text
                this.#checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`
                this.#checkoutShipping.textContent = `$${shipping.toFixed(2)}`
                this.#checkoutTax.textContent = `$${tax.toFixed(2)}`
                this.#checkoutTotal.textContent = `$${total.toFixed(2)}`
            })
        }

        renderCartItems(fragment = new DocumentFragment()) {
            return requestAnimationFrame(() => {
                state.cart.forEach(item => {
                    const el = document.createElement('zircus-cart-product')
                    el.item = item
                    fragment.appendChild(el)
                })
                this.#productList.appendChild(fragment)
            })
        }

        populateSelects(select, data = [], fn) {
            select.textContent = '' // clear children
            data.forEach((item, i) => {
                select.appendChild(
                    new ZircusElement('option', null, {
                        value: fn(item),
                        selected: i === 0,
                    })
                        .addChild(fn(item))
                        .render()
                )
            })
        }

        handleCountry(country = this.#formCountry.value) {
            return requestAnimationFrame(() => {
                this.#formState.textContent = ''
                this.#formPostalCode.value = ''
                this.populateSelects(
                    this.#formState,
                    state.countries[country].states,
                    item => item.name
                )
                this.#formStateLabel.textContent = withLang(
                    formText[country]
                )[0]
                this.#formPostalCodeLabel.textContent = withLang(
                    formText[country]
                )[1]
                this.#formPostalCode.setAttribute(
                    'pattern',
                    country === 'Canada'
                        ? CANADA_POSTAL_CODE.source
                        : US_ZIP_CODE.source
                )
                this.#formPostalCode.setAttribute(
                    'maxlength',
                    country === 'Canada' ? '7' : '10'
                )
                this.#formPostalCode.setAttribute(
                    'size',
                    country === 'Canada' ? '7' : '10'
                )
                return this.setTotals()
            })
        }

        handlePostalCode(value) {
            value = value.toUpperCase()
            return this.#formCountry.value === 'Canada'
                ? value.length === 6 && CANADA_POSTAL_CODE.test(value)
                    ? value.substring(0, 3) + ' ' + value.substring(3, 6)
                    : value
                : value.length === 6 && value[5] !== '-'
                ? value.substring(0, 5)
                : value
        }
    }

    customElements.get('zircus-payment') ||
        customElements.define('zircus-payment', Payment)
}
