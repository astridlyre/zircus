import { lang, withLang, state, API_ENDPOINT } from '../utils.js'

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
            this.style.display = 'none'
            this._isLoaded = false
            this._paymentCompleted = false
        }

        connectedCallback() {
            this.classList.add('stripe-payment-form')
            this.paymentPrice = this.querySelector('#stripe-payment-price')
            this.resultMessage = this.querySelector('#result-message')
            this._cardElement = this.querySelector('#card-element')

            formElement.addEventListener('submit', event => {
                event.preventDefault()
                this.createPaymentIntent()
            })
        }

        showError(msg = this.getAttribute('failure'), setActive) {
            setActive({ value: false })
            this.resultMessage.textContent = msg
            this.resultMessage.classList.remove('hidden')
            this.resultMessage.classList.add('red')
            setTimeout(() => {
                this.resultMessage.classList.add('hidden')
                this.resultMessage.classList.remove('red')
            }, 4000)
        }

        async createPaymentIntent() {
            const { setActive } = state.showModal({
                content: this,
                heading: this.getAttribute('heading'),
                ok: {
                    action: cbs => this.payWithCard(cbs),
                    text: this.getAttribute('buttontext'),
                },
                cancel: {
                    action: ({ close, clear }) => {
                        if (!state.cart.length)
                            location.assign(
                                withLang({ en: '/thanks', fr: '/fr/merci' })
                            )
                        close()
                        if (this._paymentCompleted) clear()
                    },
                    text: this.getAttribute('canceltext'),
                },
            })

            this.style.display = 'flex'
            setActive({ value: false, spinning: true })

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
                    if (data.error) return this.showError(data.error, setActive)
                    this.paymentPrice.textContent = `Calculated total: $${data.total.toFixed(
                        2
                    )}`
                    this.loadStripe(data, setActive)
                })
        }

        loadStripe(data, setActive) {
            setActive({ value: false })
            if (this._isLoaded) return
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
                setActive({ value: !event.empty })
                event.error?.message &&
                    this.showError(event.error.message, setActive)
            })
            this._card = card
            this._secret = data.clientSecret
            this._isLoaded = true
        }

        payWithCard({ setActive, setCustomClose }) {
            setActive({ value: false, spinning: true })
            stripe
                .confirmCardPayment(this._secret, {
                    payment_method: { card: this._card },
                })
                .then(result => {
                    if (result.error)
                        return this.showError(result.error.message, setActive)
                    return this.orderComplete({ setActive, setCustomClose })
                })
        }

        orderComplete({ setActive, setCustomClose }) {
            this._paymentCompleted = true
            setActive({ value: false, spinning: false })
            state.cart = () => []
            state.secret = null
            setCustomClose({
                text: withLang({ en: 'finish', fr: 'complétez' }),
                title: withLang({ en: 'finish', fr: 'complétez' }),
            })
            this.resultMessage.textContent = this.getAttribute('success')
            this.resultMessage.classList.remove('hidden')
        }
    }

    customElements.get('zircus-stripe') ||
        customElements.define('zircus-stripe', ZircusStripe)
}
