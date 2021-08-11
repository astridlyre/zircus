import {
    lang,
    withLang,
    state,
    API_ENDPOINT,
    createNotificationFailure,
    createNotificationSuccess,
    ZircusElement,
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
        #modal
        #textContainer
        #formElement
        #paymentPrice
        #resultMessage
        #cardElement

        connectedCallback() {
            this.classList.add('stripe-payment-form')
            this.#formElement = document.querySelector('zircus-checkout-form')
            this.#modal = new ZircusElement('div').render()
            this.#textContainer = new ZircusElement(
                'div',
                'stripe-payment-form-text'
            ).render()
            this.#paymentPrice = new ZircusElement('span', null, {
                id: 'stripe-payment-price',
            }).render()
            this.#resultMessage = new ZircusElement(
                'span',
                ['result-message', 'hidden'],
                { id: 'stripe-result-message' }
            ).render()
            this.#cardElement = new ZircusElement(
                'div',
                ['stripe-payment-form-card', 'hidden'],
                { id: 'stripe-card-element' }
            ).render()

            this.#textContainer.appendChild(this.#paymentPrice)
            this.#textContainer.appendChild(this.#resultMessage)
            this.#modal.appendChild(this.#textContainer)
            this.#modal.appendChild(this.#cardElement)
            this.appendChild(this.#modal)

            this.#formElement.addEventListener('form-submit', event => {
                event.detail.method === 'stripe' &&
                    this.createPaymentIntent(event.detail.formData)
            })
        }

        disconnectedCallback() {
            this.#isLoaded = false
            this.#cardElement.classList.add('hidden')
        }

        handleCardError({ message = null, setActive }) {
            return message
                ? requestAnimationFrame(() => {
                      setActive({ value: false })
                      this.#resultMessage.textContent = message
                      this.#resultMessage.classList.remove('hidden')
                      this.#resultMessage.classList.add('red')
                  })
                : requestAnimationFrame(() => {
                      setActive({ value: true })
                      this.#resultMessage.classList.add('hidden')
                      this.#resultMessage.classList.remove('red')
                  })
        }

        async createPaymentIntent(formData) {
            const { setActive } = state.showModal({
                content: this.#modal,
                heading: this.getAttribute('heading'),
                ok: {
                    action: cbs => this.payWithCard(cbs),
                    text: this.getAttribute('buttontext'),
                    title: 'Pay now',
                },
                cancel: {
                    action: ({ close, setActive }) => {
                        this.handleCardError({ setActive })
                        close()
                        if (!state.cart.length)
                            document.querySelector('zircus-router').page =
                                withLang({ en: '/thanks', fr: '/fr/merci' })
                    },
                    text: this.getAttribute('canceltext'),
                    title: 'Cancel',
                },
            })

            requestAnimationFrame(() => {
                this.#cardElement.classList.remove('hidden')
            })

            setActive({ value: false, spinning: true })

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
                    if (data.error)
                        return this.handleCardError(data.error, setActive)
                    this.#paymentPrice.textContent = `Calculated total: $${data.total.toFixed(
                        2
                    )}`
                    return this.loadStripe(data, setActive)
                })
                .catch(e => {
                    this.handleCardError(e.message, setActive)
                    createNotificationFailure(`Payment Intent: ${e.message}`)
                })
        }

        loadStripe(data, setActive) {
            setActive({ value: false })
            if (this.#isLoaded) return
            const elements = stripe.elements()
            const card = elements.create('card', { style: stripeStyle })
            card.mount('#stripe-card-element')
            card.on('change', event => {
                setActive({ value: !event.empty })
                if (event.error) {
                    this.handleCardError({
                        message: event.error.message,
                        setActive,
                    })
                } else {
                    this.handleCardError({ message: null, setActive })
                }
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
                        return this.handleCardError(
                            result.error.message,
                            setActive
                        )
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
                this.#cardElement.textContent = ''
                this.#cardElement.classList.add('disabled')
                this.#resultMessage.textContent = this.getAttribute('success')
                this.#resultMessage.classList.remove('hidden')
            })
            createNotificationSuccess(
                this.getAttribute('complete').replace('|', state.order.name)
            )
        }
    }

    customElements.get('zircus-stripe') ||
        customElements.define('zircus-stripe', ZircusStripe)
}
