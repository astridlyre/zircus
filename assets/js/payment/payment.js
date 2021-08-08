import { state, ZircusElement, calculateTax, lang } from '../utils.js'
import intText from '../int/intText.js'
import cartProduct from '../cart/cartProduct.js'
import initStripe from './stripe.js'
import shippingInputs from './shippingInputs.js'
import shippingTypes from './shippingTypes.js'

const CANADA_POSTAL_CODE = /^[A-Za-z][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]$/
const US_ZIP_CODE = /^[0-9]{5}(-[0-9]{4})?$/

export default function payment() {
    const formText = intText.checkout.formText
    shippingInputs({
        shippingTypes,
    })

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
            this.productTemplate = this.querySelector(
                '#checkout-product-template'
            )
            this.productList = this.querySelector('#checkout-products')
            this.placeOrderButton = this.querySelector('#place-order')

            initStripe({
                formName: this.formName,
                formEmail: this.formEmail,
                formStreetAddress: this.formStreetAddress,
                formCity: this.formCity,
                formState: this.formState,
                formCountry: this.formCountry,
                formZip: this.formZip,
                formShipping: this.shippingInputs,
                formElement: this.formElement,
            })

            // Set totals
            this.setTotals()

            // Render Items
            this.renderCartItems()
            this.populateSelects(
                this.formCountry,
                Object.keys(state.countries),
                item => item
            )
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
        }

        setTotals() {
            const shipping = Number(
                shippingTypes[this.shippingInputs.getAttribute('shipping-type')]
                    .price
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
        }

        renderCartItems() {
            const fragment = new DocumentFragment()
            state.cart.forEach(item =>
                fragment.appendChild(
                    cartProduct({
                        item,
                        productTemplate: this.productTemplate,
                    })
                )
            )
            this.productList.appendChild(fragment)
        }

        populateSelects(select, data = [], fn) {
            select.textContent = '' // clear children
            data.forEach(item => {
                select.appendChild(
                    new ZircusElement('option', null, {
                        value: fn(item),
                    })
                        .addChild(fn(item))
                        .render()
                )
            })
        }

        handleCountry() {
            const country = this.formCountry.value
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
            this.formZip.setAttribute('size', country === 'Canada' ? '7' : '10')
            this.setTotals()
        }

        normalizeZip(value) {
            value = value.toUpperCase()
            if (this.formCountry.value === 'Canada') {
                if (value.length === 6 && CANADA_POSTAL_CODE.test(value))
                    return value.substring(0, 3) + ' ' + value.substring(3, 6)
                return value
            } else {
                if (value.length === 6 && value[5] !== '-')
                    return value.substring(0, 5)
                return value
            }
        }
    }

    if (!customElements.get('zircus-payment'))
        customElements.define('zircus-payment', Payment)
}
