import { q, API_ENDPOINT, state, Element, calculateTax } from './utils.js'
const stripe = Stripe(
    'pk_test_51J93KzDIzwSFHzdzCZtyRcjMvw8em0bhnMrVmkBHaMFHuc2nkJ156oJGNxuz0G7W4Jx0R6OCy2nBXYTt6U8bSYew00PIAPcntP'
)
const withLogging =
    fn =>
    (...args) => {
        const result = fn(...args)
        console.log(result)
        return result
    }

;(() => {
    const placeOrder = q('place-order')
    if (!placeOrder) return
    if (state.cart.length === 0) location.assign('/')

    class Checkout {
        constructor() {
            this.name = q('checkout-name')
            this.email = q('checkout-email')
            this.streetAddress = q('checkout-street')
            this.city = q('checkout-city')
            this.state = q('checkout-state')
            this.stateText = q('checkout-state-text')
            this.country = q('checkout-country')
            this.zip = q('checkout-zip')
            this.zipText = q('checkout-zip-text')
            this.paymentModal = q('stripe-payment-modal')
            this.paymentForm = q('stripe-payment-form')
            this.payBtn = q('pay-button')
            this.cardError = q('card-error')
            this.spinner = q('spinner')
            this.btnText = q('button-text')
            this.placeOrder = q('place-order')
            this.checkoutForm = q('checkout-form')
            this.cancel = q('cancel')
            this.checkoutSubtotal = q('checkout-subtotal')
            this.checkoutTax = q('checkout-tax')
            this.checkoutTotal = q('checkout-total')
            this.template = q('checkout-product-template')
            this.checkoutList = q('checkout-products')
            this.isLoaded = false
            this.checkoutForm.addEventListener('submit', event => {
                event.preventDefault()
                this.createPaymentIntent()
            })
            this.cancel.addEventListener('click', () => this.showModal(false))
            // Add functionality for Countries States and Cities
            state.addHook(s => {
                this.populateSelects(
                    this.country,
                    Object.keys(s.countries),
                    item => item
                )
                this.handleCountry()
            })
            this.country.addEventListener('input', () => this.handleCountry())
            this.state.addEventListener('input', () => this.setTotals())
            this.zip.addEventListener('input', e => {
                e.target.value = this.normalizeZip(
                    e.target.value,
                    this.country.value
                )
            })
            this.setTotals()
            this.render()
        }

        render() {
            const fragment = new DocumentFragment()
            state.cart.forEach(item => {
                const template = this.template.content.cloneNode(true)
                const link = template.querySelector('a')
                const img = template.querySelector('img')
                const desc = template.querySelector('p')

                link.setAttribute(
                    'href',
                    `/products/${item.name
                        .toLowerCase()
                        .split(' ')
                        .join('-')}.html`
                )
                img.src = item.images.sm_a
                desc.textContent = `${item.name} (${item.size}) - ${item.quantity} x $${item.price}`

                return fragment.appendChild(template)
            })
            this.checkoutList.appendChild(fragment)
        }

        setTotals() {
            // Tally up
            this.subtotal = state.cart.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            )
            this.tax =
                this.subtotal *
                calculateTax(this.country.value, this.state.value)
            this.total = this.subtotal + this.tax

            // Set text
            this.checkoutSubtotal.innerText = `$${this.subtotal.toFixed(2)}`
            this.checkoutTax.innerText = `$${this.tax.toFixed(2)}`
            this.checkoutTotal.innerText = `$${this.total.toFixed(2)}`

            return this
        }

        showModal(show) {
            this.loading(false)
            if (show) {
                document.body.classList.add('hide-y')
                q('blur').classList.add('blur')
                this.paymentModal.classList.add('show-modal')
                this.payBtn.disabled = true
                q('payment-price').innerText = `$${this.total.toFixed(2)}`
            } else {
                document.body.classList.remove('hide-y')
                q('blur').classList.remove('blur')
                this.paymentModal.classList.remove('show-modal')
                if (state.cart.length === 0) location.assign('/')
            }
        }

        async createPaymentIntent() {
            this.showModal(true)
            this.loading(true)

            const req = {
                update: state.secret,
                name: this.name.value,
                email: this.email.value,
                streetAddress: this.streetAddress.value,
                city: this.city.value,
                country: this.country.value,
                state: this.state.value,
                zip: this.zip.value,
                items: state.cart.map(item => ({
                    type: item.type,
                    prefix: item.prefix,
                    size: item.size,
                    name: item.name,
                    color: item.color,
                    quantity: item.quantity,
                })),
            }

            fetch(`${API_ENDPOINT}/orders/create-payment-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req),
            })
                .then(data => data.json())
                .then(data => {
                    state.secret = data.clientSecret
                    q('payment-price').innerText = `$${data.total.toFixed(2)}`
                    this.loadStripe(data)
                    this.loading(false)
                })
        }

        loadStripe(data) {
            if (this.isLoaded) return
            this.isLoaded = true
            const elements = stripe.elements()
            const style = {
                base: {
                    color: '#1a171b',
                    fontFamily: 'Nunito, sans-serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '16px',
                    '::placeholder': {
                        color: '#1a171b',
                    },
                },
                invalid: {
                    fontFamily: 'Nunito, sans-serif',
                    color: '#fa755a',
                    iconColor: '#fa755a',
                },
            }

            const card = elements.create('card', { style: style })
            card.mount('#card-element')
            card.on('change', event => {
                this.payBtn.disabled = event.empty
                this.cardError.textContent = event.error
                    ? event.error.message
                    : ''
            })

            this.paymentForm.addEventListener('submit', event => {
                event.preventDefault()
                this.payWithCard(stripe, card, data.clientSecret)
            })
        }

        payWithCard(stripe, card, clientSecret) {
            this.loading(true)
            stripe
                .confirmCardPayment(clientSecret, {
                    payment_method: { card },
                })
                .then(result => {
                    if (result.error)
                        return this.showError(result.error.message)
                    return this.orderComplete()
                })
        }

        showError(msg) {
            this.loading(false)
            this.cardError.textContent = msg
            setTimeout(() => {
                this.cardError.textContent = ''
            }, 4000)
        }

        loading(isLoading) {
            if (isLoading) {
                this.payBtn.disabled = true
                this.spinner.classList.remove('hidden')
                this.btnText.classList.add('hidden')
            } else {
                this.payBtn.disabled = false
                this.spinner.classList.add('hidden')
                this.btnText.classList.remove('hidden')
            }
        }

        orderComplete() {
            this.loading(false)
            state.cart = () => []
            state.secret = null
            q('result-message').classList.remove('hidden')
            this.payBtn.disabled = true
            this.cancel.innerText = 'close'
            this.cancel.classList.add('btn__primary')
            this.cancel.classList.remove('btn__secondary')
        }

        populateSelects(select, data = [], fn) {
            select.textContent = ''
            data.forEach(item => {
                select.appendChild(
                    new Element('option', null, {
                        value: fn(item),
                    })
                        .addChild(fn(item))
                        .render()
                )
            })
        }

        handleCountry() {
            const country = this.country.value
            this.state.textContent = ''
            this.populateSelects(
                this.state,
                state.countries[country].states,
                item => item.name
            )
            this.stateText.innerText =
                this.country.value === 'Canada' ? 'Province' : 'State'
            this.zipText.innerText =
                this.country.value === 'Canada' ? 'Postal Code' : 'Zip'
            this.zip.setAttribute(
                'pattern',
                this.country.value === 'Canada'
                    ? this.canadaPostalCode.source
                    : this.usZipCode.source
            )
            this.zip.setAttribute(
                'maxlength',
                this.country.value === 'Canada' ? '7' : '10'
            )
            this.setTotals()
        }

        get canadaPostalCode() {
            return /^[A-Za-z][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]$/
        }

        get usZipCode() {
            return /^[0-9]{5}(-[0-9]{4})?$/
        }

        normalizeZip(value) {
            const val = value.toUpperCase()
            if (this.country.value === 'Canada') {
                if (val.length === 6 && this.canadaPostalCode.test(val))
                    return val.substring(0, 3) + ' ' + val.substring(3, 6)
                return val
            } else {
                if (val.length === 6 && val[5] !== '-')
                    return val.substring(0, 5)
                return val
            }
        }
    }

    return new Checkout()
})()
