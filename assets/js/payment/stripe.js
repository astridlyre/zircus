import { lang, withLang, state, q, API_ENDPOINT } from '../utils.js'

const stripe = Stripe(
    'pk_test_51J93KzDIzwSFHzdzCZtyRcjMvw8em0bhnMrVmkBHaMFHuc2nkJ156oJGNxuz0G7W4Jx0R6OCy2nBXYTt6U8bSYew00PIAPcntP'
)

export default function initStripe(form) {
    const {
        formName,
        formEmail,
        formStreetAddress,
        formCity,
        formCountry,
        formState,
        formZip,
        formElement,
    } = form

    class ZircusStripe extends HTMLElement {
        constructor() {
            super()
            this._isLoaded = false
        }

        connectedCallback() {
            this.cardError = this.querySelector('#card-error')
            this.payButton = this.querySelector('#pay-button')
            this.buttonText = this.querySelector('#pay-button-text')
            this.spinner = this.querySelector('#spinner')
            this.paymentPrice = this.querySelector('#payment-price')
            this.resultMessage = this.querySelector('#result-message')
            this.paymentForm = this.querySelector('#stripe-payment-form')
            this.cancelButton = this.querySelector('#cancel')

            formElement.addEventListener('submit', event => {
                event.preventDefault()
                this.createPaymentIntent()
            })
            this.cancelButton.addEventListener('click', () =>
                this.showModal(false)
            )
        }

        set isLoaded(value) {
            this._isLoaded = value
            this.#handleLoading()
        }

        get isLoaded() {
            return this._isLoaded
        }

        #handleLoading = () => {
            if (!this.isLoaded) {
                this.payButton.disabled = true
                this.spinner.classList.remove('hidden')
                this.buttonText.classList.add('hidden')
            } else {
                this.payButton.disabled = false
                this.spinner.classList.add('hidden')
                this.buttonText.classList.remove('hidden')
            }
        }

        #showError(msg) {
            this.isLoaded = false
            this.cardError.textContent = msg
            setTimeout(() => {
                this.cardError.textContent = ''
            }, 4000)
        }

        showModal(show) {
            this.isLoaded = false
            if (show) {
                document.body.classList.add('hide-y')
                q('blur').classList.add('blur')
                this.classList.add('show-modal')
                this.payButton.disabled = true
                this.paymentPrice.textContent = ''
            } else {
                document.body.classList.remove('hide-y')
                q('blur').classList.remove('blur')
                this.classList.remove('show-modal')
                if (state.cart.length === 0)
                    location.assign(
                        withLang({ en: '/thanks', fr: '/fr/merci' })
                    )
            }
        }

        async createPaymentIntent() {
            this.showModal(true)
            this.isLoaded = false

            const req = {
                lang: lang(),
                update: state.secret,
                name: formName.value,
                email: formEmail.value,
                streetAddress: formStreetAddress.value,
                city: formCity.value,
                country: formCountry.value,
                state: formState.value,
                zip: formZip.value,
                items: state.cart.map(item => ({
                    images: item.images,
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
                    state.order = {
                        id: data.id,
                        name: data.name,
                        email: data.email,
                    }
                    this.paymentPrice.textContent = `$${data.total.toFixed(2)}`
                    this.loadStripe(data)
                    this.isLoaded = true
                })
        }

        loadStripe(data) {
            if (this.isLoaded) return
            this.isLoaded = true
            const elements = stripe.elements()
            const style = {
                base: {
                    color: '#211b22',
                    fontFamily: 'Nunito, sans-serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '16px',
                    '::placeholder': {
                        color: '#8b808f',
                    },
                },
                invalid: {
                    fontFamily: 'Nunito, sans-serif',
                    color: '#8f3342',
                    iconColor: '#8f3342',
                },
            }

            const card = elements.create('card', { style: style })
            card.mount('#card-element')
            card.on('change', event => {
                this.payButton.disabled = event.empty
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
            this.isLoaded = false
            stripe
                .confirmCardPayment(clientSecret, {
                    payment_method: { card },
                })
                .then(result => {
                    if (result.error)
                        return this.#showError(result.error.message)
                    return this.orderComplete()
                })
        }

        orderComplete() {
            this.isLoaded = true
            state.cart = () => []
            state.secret = null
            this.resultMessage.classList.remove('hidden')
            this.payButton.disabled = true
            this.payButton.textContent = ''
            this.cancelButton.textContent = withLang({
                en: 'finish',
                fr: 'complétez',
            })
            this.cancelButton.classList.replace(
                'btn__secondary',
                'btn__primary'
            )
        }
    }

    if (!customElements.get('zircus-stripe'))
        customElements.define('zircus-stripe', ZircusStripe)
}
