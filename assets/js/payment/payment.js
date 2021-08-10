import { state, ZircusElement, calculateTax, lang } from '../utils.js'
import intText from '../int/intText.js'
import initStripe from './stripe.js'
import shippingInputs from './shippingInputs.js'
import shippingTypes from './shippingTypes.js'

const CANADA_POSTAL_CODE = /^[A-Za-z][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]$/
const US_ZIP_CODE = /^[0-9]{5}(-[0-9]{4})?$/

export default function payment() {
    const { formText } = intText.checkout
    shippingInputs({ shippingTypes })
    initStripe()

    class Payment extends HTMLElement {
        connectedCallback() {
            if (state.cart.length === 0) location.assign('/')
            this.formName = this.querySelector('#checkout-name')
            this.formEmail = this.querySelector('#checkout-email')
            this.formStreetAddress = this.querySelector('#checkout-street')
            this.formCity = this.querySelector('#checkout-city')
            this.formState = this.querySelector('#checkout-state')
            this.formStateLabel = this.querySelector('#checkout-state-text')
            this.formCountry = this.querySelector('#checkout-country')
            this.formZip = this.querySelector('#checkout-zip')
            this.formZipLabel = this.querySelector('#checkout-zip-text')
            this.formElement = this.querySelector('#checkout-form')
            this.checkoutSubtotal = this.querySelector('#checkout-subtotal')
            this.checkoutTax = this.querySelector('#checkout-tax')
            this.checkoutTotal = this.querySelector('#checkout-total')
            this.checkoutShipping = this.querySelector('#checkout-shipping')
            this.shippingInputs = this.querySelector('zircus-shipping-inputs')
            this.productList = this.querySelector('#checkout-products')
            this.placeOrderButton = this.querySelector('#place-order')

            // Render Items
            this.renderCartItems()
            this.handleCountry()

            // Add event listeners
            this.formCountry.addEventListener('input', () =>
                this.handleCountry()
            )
            this.formState.addEventListener('input', () => this.setTotals())
            this.formZip.addEventListener('input', e => {
                e.target.value = this.normalizeZip(
                    e.target.value,
                    this.formCountry.value
                )
            })

            this.shippingInputs.addEventListener('method-changed', () =>
                this.setTotals()
            )
            this.shippingInputs.addEventListener('mounted', () =>
                this.setTotals()
            )
        }

        disconnectedCallback() {
            this.formCountry.removeEventListener('input', () =>
                this.handleCountry()
            )
            this.formState.removeEventListener('input', () => this.setTotals())
            this.formZip.removeEventListener('input', e => {
                e.target.value = this.normalizeZip(
                    e.target.value,
                    this.formCountry.value
                )
            })
            this.shippingInputs.removeEventListener('method-changed', () =>
                this.setTotals()
            )
            this.shippingInputs.removeEventListener('mounted', () =>
                this.setTotals()
            )
        }

        setTotals() {
            requestAnimationFrame(() => {
                const shipping = Number(
                    shippingTypes[this.shippingInputs.value]?.price
                )
                const subtotal = state.cart.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                )
                const tax =
                    (subtotal + shipping) *
                    calculateTax(this.formCountry.value, this.formState.value)
                const total = subtotal + tax

                // Set text
                this.checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`
                this.checkoutShipping.textContent = `$${shipping.toFixed(2)}`
                this.checkoutTax.textContent = `$${tax.toFixed(2)}`
                this.checkoutTotal.textContent = `$${total.toFixed(2)}`
            })
        }

        renderCartItems(fragment = new DocumentFragment()) {
            return requestAnimationFrame(() => {
                state.cart.forEach(item => {
                    const el = document.createElement('zircus-cart-product')
                    el.item = item
                    fragment.appendChild(el)
                })
                this.productList.appendChild(fragment)
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

        handleCountry(country = this.formCountry.value) {
            return requestAnimationFrame(() => {
                this.formState.textContent = ''
                this.formZip.value = ''
                this.populateSelects(
                    this.formState,
                    state.countries[country].states,
                    item => item.name
                )
                this.formStateLabel.textContent = formText[country][lang()][0]
                this.formZipLabel.textContent = formText[country][lang()][1]
                this.formZip.setAttribute(
                    'pattern',
                    country === 'Canada'
                        ? CANADA_POSTAL_CODE.source
                        : US_ZIP_CODE.source
                )
                this.formZip.setAttribute(
                    'maxlength',
                    country === 'Canada' ? '7' : '10'
                )
                this.formZip.setAttribute(
                    'size',
                    country === 'Canada' ? '7' : '10'
                )
                return this.setTotals()
            })
        }

        normalizeZip(value) {
            value = value.toUpperCase()
            return this.formCountry.value === 'Canada'
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
