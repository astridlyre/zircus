import {
    lang,
    withLang,
    state,
    API_ENDPOINT,
    createNotificationFailure,
    createNotificationSuccess,
} from '../utils.js'

const stripe = Stripe(
    'pk_test_51J93KzDIzwSFHzdzCZtyRcjMvw8em0bhnMrVmkBHaMFHuc2nkJ156oJGNxuz0G7W4Jx0R6OCy2nBXYTt6U8bSYew00PIAPcntP'
)

const stripeStyle = {
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

export default function initStripe() {
    class ZircusStripe extends HTMLElement {
        #isLoaded = false
        #card
        #secret

        constructor() {
            super()
            this.classList.add('hidden')
        }

        connectedCallback() {
            this.formElement = document.querySelector('#checkout-form')
            this.classList.add('stripe-payment-form')
            this.paymentPrice = this.querySelector('#stripe-payment-price')
            this.resultMessage = this.querySelector('#result-message')
            this._cardElement = this.querySelector('#card-element')

            this.formElement.addEventListener(
                'submit',
                event => this.createPaymentIntent(event),
                { once: true }
            )
        }

        disconnectedCallback() {
            this.formElement.removeEventListener('submit', event =>
                this.createPaymentIntent(event)
            )
        }

        showError(msg = this.getAttribute('failure'), setActive) {
            setActive({ value: false })
            this.resultMessage.textContent = msg
            this.resultMessage.classList.remove('hidden')
            this.resultMessage.classList.add('red')
            setTimeout(() => {
                this.resultMessage.classList.add('hidden')
                this.resultMessage.classList.remove('red')
            }, 5000)
        }

        async createPaymentIntent(event) {
            event.preventDefault()
            const { setActive } = state.showModal({
                content: this,
                heading: this.getAttribute('heading'),
                ok: {
                    action: cbs => this.payWithCard(cbs),
                    text: this.getAttribute('buttontext'),
                    title: 'Pay now',
                },
                cancel: {
                    action: ({ close }) => {
                        close()
                        if (!state.cart.length)
                            document.querySelector('zircus-router').page =
                                withLang({ en: '/thanks', fr: '/fr/merci' })
                    },
                    text: this.getAttribute('canceltext'),
                    title: 'Cancel',
                },
            })

            requestAnimationFrame(() => this.classList.remove('hidden'))
            setActive({ value: false, spinning: true })

            const formData = [
                ...new FormData(this.formElement).entries(),
            ].reduce(
                (obj, [key, val]) =>
                    key.startsWith('address-')
                        ? {
                              ...obj,
                              address: {
                                  ...obj.address,
                                  [key.replace('address-', '')]: val,
                              },
                          }
                        : {
                              ...obj,
                              [key]: val,
                          },
                { address: {} }
            )

            const req = {
                ...formData,
                lang: lang(),
                update: state.secret,
                items: state.cart.map(item => ({
                    type: item.type,
                    quantity: item.quantity,
                })),
            }

            return fetch(`${API_ENDPOINT}/orders/create-payment-intent`, {
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
                    if (data.error) return this.showError(data.error, setActive)
                    this.paymentPrice.textContent = `Calculated total: $${data.total.toFixed(
                        2
                    )}`
                    return this.loadStripe(data, setActive)
                })
                .catch(e => {
                    this.showError(e.message, setActive)
                    createNotificationFailure(`Payment Intent: ${e.message}`)
                })
        }

        loadStripe(data, setActive) {
            setActive({ value: false })
            if (this.#isLoaded) return
            const elements = stripe.elements()
            const card = elements.create('card', { style: stripeStyle })
            card.mount('#card-element')
            card.on('change', event => {
                setActive({ value: !event.empty })
                event.error?.message &&
                    this.showError(event.error.message, setActive)
            })
            this.#card = card
            this.#secret = data.clientSecret
            this.#isLoaded = true
        }

        payWithCard({ setActive, setCustomClose }) {
            setActive({ value: false, spinning: true })
            return stripe
                .confirmCardPayment(this.#secret, {
                    payment_method: { card: this.#card },
                })
                .then(result => {
                    if (result.error)
                        return this.showError(result.error.message, setActive)
                    return this.orderComplete({ setActive, setCustomClose })
                })
        }

        orderComplete({ setActive, setCustomClose }) {
            setActive({ value: false, spinning: false })
            state.cart = () => []
            state.secret = null
            requestAnimationFrame(() => {
                setCustomClose({
                    text: withLang({ en: 'finish', fr: 'complétez' }),
                    title: withLang({ en: 'finish', fr: 'complétez' }),
                })
                this.resultMessage.textContent = this.getAttribute('success')
                this.resultMessage.classList.remove('hidden')
            })
            createNotificationSuccess(
                this.getAttribute('complete').replace('|', state.order.name)
            )
        }
    }

    customElements.get('zircus-stripe') ||
        customElements.define('zircus-stripe', ZircusStripe)
}
