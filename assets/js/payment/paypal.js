import {
    withLang,
    state,
    API_ENDPOINT,
    createNotificationFailure,
    createNotificationSuccess,
    ZircusElement,
    createOrderRequest,
    isJson,
    isError,
} from '../utils.js'
import paypalIcon from './paypalIcon.js'
import withAsyncScript from './withAsyncScript.js'

const CLIENT_ID =
    'Aef4eC1Xxfc-wTn_x-wNgMzYB44l7d61xBmi_xB4E_bSFhYjZHsmQudrj8pMB3dn-BxA_cK227PcBzNv'
const src = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}`

const paypalStyle = {
    shape: 'rect',
    color: 'black',
    layout: 'horizontal',
    label: 'paypal',
    height: window.innerWidth < 1920 ? 44 : window.innerWidth < 2160 ? 50 : 55,
    tagline: false,
}

export default function initPaypal() {
    class ZircusPayPal extends HTMLElement {
        #formElement
        #button
        #template
        #text
        #message
        #paymentComplete = false
        #paypalButton
        #scriptLoaded

        connectedCallback() {
            this.createElements()

            // Listen for custom form submit
            this.#formElement.addEventListener('form-submit', event => {
                const { paymentMethod, formData } = event.detail
                paymentMethod === 'paypal' &&
                    (this.#scriptLoaded
                        ? this.showModal().mountPayPal({
                              formData,
                              paymentMethod,
                          })
                        : createNotificationFailure(`Paypal is still loading`))
            })

            // Load PayPal third-party script
            this.loadPaypal().then(res => {
                if (res.ok) this.#scriptLoaded = true
            })
        }

        disconnectedCallback() {
            this.scriptElement?.remove()
        }

        async loadPaypal() {
            return await this.loadScript({
                src: `${src}&currency=CAD&enable-funding=venmo`,
                id: 'paypal-script',
            })
        }

        showModal() {
            state.showModal({
                content: this.mountElements(),
                heading: this.getAttribute('name'),
                ok: {
                    text: this.getAttribute('canceltext'),
                    title: this.getAttribute('canceltext'),
                    action: ({ close }) => {
                        close()
                        this.#paymentComplete &&
                            (document.querySelector('zircus-router').page =
                                withLang({ en: '/thanks', fr: '/fr/merci' }))
                    },
                },
            })
            return this
        }

        async mountPayPal({ formData, paymentMethod }) {
            const orderData = createOrderRequest({ formData, paymentMethod })
            const { amount } = await this.getTotal({ orderData })
            this.#message.textContent = `Calculated Total: $${amount.value}`
            requestAnimationFrame(() =>
                paypal
                    .Buttons({
                        style: paypalStyle,
                        createOrder: (data, actions) =>
                            this.createOrder(data, actions, amount),
                        onApprove: (data, actions) =>
                            this.onApprove(data, actions, orderData),
                    })
                    .render('#paypal-button')
            )
        }

        createOrder(data, actions, amount) {
            return actions.order.create({
                purchase_units: [
                    {
                        amount,
                    },
                ],
            })
        }

        async getTotal({ orderData }) {
            return await fetch(`${API_ENDPOINT}/orders/price`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            })
                .then(isJson)
                .then(isError)
                .catch(error =>
                    createNotificationFailure(
                        `Error getting order total: ${error}`
                    )
                )
        }

        async createPaymentIntent({ orderData }) {
            await fetch(`${API_ENDPOINT}/orders/create-payment-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            })
                .then(isJson)
                .then(isError)
                .catch(
                    createNotificationFailure(
                        `Error creating payment intent: ${error}`
                    )
                )
        }

        changeButtonText() {
            const button = document.getElementById('modal-button-text')
            button.textContent = withLang({
                en: 'close',
                fr: 'fermer',
            })
            button.setAttribute(
                'title',
                withLang({
                    en: 'Close modal and finish order',
                    fr: 'Fermez modal et completez votre commande',
                })
            )
        }

        onApprove(data, actions, orderData) {
            return actions.order
                .capture()
                .then(async res => {
                    const capture = res.purchase_units[0].payments.captures[0]
                    const order = await fetch(
                        `${API_ENDPOINT}/orders/create-payment-intent`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                ...orderData,
                                orderId: capture.id,
                                amount: capture.amount,
                            }),
                        }
                    )
                        .then(isJson)
                        .then(isError)
                        .catch(error =>
                            createNotificationFailure(
                                `Error creating order: ${error}. Please contact support (Order id: ${capture.id}`
                            )
                        )
                    createNotificationSuccess(
                        this.getAttribute('complete').replace('|', order.name)
                    )
                    return requestAnimationFrame(() => {
                        this.#text.textContent = this.getAttribute('success')
                        this.#text.classList.add('green')
                        this.#paypalButton.textContent = ''
                        this.#paypalButton.classList.add('disabled')
                        this.#paymentComplete = true
                        this.changeButtonText()
                        state.cart = () => []
                        state.order = {
                            name: order.name,
                            email: order.email,
                            orderId: order.orderId,
                        }
                    })
                })
                .catch(e => {
                    this.#message.textContent = this.getAttribute('failure')
                    this.#message.classList.add('red')
                    createNotificationFailure(`Payment failed: ${e}`)
                })
        }

        onError(error) {
            createNotificationFailure(error)
        }

        mountElements(parent = document.createElement('div')) {
            const template = this.#template.content.cloneNode(true)
            this.#paypalButton = template.querySelector('#paypal-button')
            this.#text = template.querySelector('#paypal-text')
            this.#message = template.querySelector('#paypal-message')
            this.#text.textContent = withLang({
                en: 'Please continue payment through PayPal order page:',
                fr: 'Continuez votre order sur le site PayPal:',
            })
            parent.appendChild(template)
            return parent
        }

        createElements() {
            this.#template = document.querySelector('#paypal-template')
            this.#formElement = document.querySelector('zircus-checkout-form')
            this.#button = new ZircusElement('button', 'paypal-button', {
                title: this.getAttribute('title'),
                value: 'paypal',
                name: this.getAttribute('name'),
            })
                .addChild(
                    new ZircusElement('img', null, {
                        src: paypalIcon,
                    })
                )
                .render()
            this.appendChild(this.#button)
        }
    }

    Object.assign(ZircusPayPal.prototype, withAsyncScript())

    customElements.get('zircus-paypal') ||
        customElements.define('zircus-paypal', ZircusPayPal)
}
