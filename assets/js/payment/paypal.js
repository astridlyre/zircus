import {
    lang,
    withLang,
    state,
    API_ENDPOINT,
    createNotificationFailure,
    createNotificationSuccess,
    ZircusElement,
    calculateTax,
} from '../utils.js'
import paypalIcon from './paypalIcon.js'
import withAsyncScript from './withAsyncScript.js'
import shippingTypes from './shippingTypes.js'

const CLIENT_ID =
    'Aef4eC1Xxfc-wTn_x-wNgMzYB44l7d61xBmi_xB4E_bSFhYjZHsmQudrj8pMB3dn-BxA_cK227PcBzNv'
const src = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}`

const paypalStyle = {
    shape: 'rect',
    color: 'black',
    layout: 'horizontal',
    label: 'paypal',
    height: 48,
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

        connectedCallback() {
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
            this.#formElement.addEventListener('form-submit', async event => {
                if (event.detail.method === 'paypal') {
                    await this.loadPaypal({ address: { country: 'Canada' } })
                        .then(res =>
                            res.ok
                                ? this.createPaymentIntent(
                                      event.detail.formData
                                  )
                                : createNotificationFailure(
                                      `PayPal not yet loaded: ${e.message}`
                                  )
                        )
                        .catch(e =>
                            createNotificationFailure(
                                `Form submit error: ${e.message}`
                            )
                        )
                }
            })
        }

        disconnectedCallback() {
            this.scriptElement?.remove()
        }

        async loadPaypal({ address }) {
            return this.loadScript({
                src: `${src}&currency=${
                    address.country === 'Canada' ? 'CAD' : 'USD'
                }&enable-funding=venmo`,
                id: 'paypal-script',
            })
        }

        async createPaymentIntent(formData) {
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
            requestAnimationFrame(() => {
                paypal
                    .Buttons({
                        style: paypalStyle,
                        createOrder: (data, actions) =>
                            this.createOrder(data, actions, formData),
                        onApprove: (data, actions) =>
                            this.onApprove(data, actions),
                    })
                    .render('#paypal-button')
            })
        }

        createOrder(data, actions, formData) {
            const subtotal =
                state.cart.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                ) + shippingTypes[formData.shippingMethod].price
            const tax =
                subtotal * calculateTax(formData.country, formData.state)
            const total = subtotal + tax
            return actions.order.create({
                purchase_units: [
                    {
                        amount: {
                            value: total.toFixed(2),
                        },
                    },
                ],
            })
        }

        onApprove(data, actions, setCustomClose) {
            return actions.order
                .capture()
                .then(orderData => {
                    createNotificationSuccess(
                        this.getAttribute('complete').replace(
                            '|',
                            orderData.payer.name.given_name
                        )
                    )
                    return requestAnimationFrame(() => {
                        this.#text.textContent = this.getAttribute('success')
                        this.#text.classList.add('green')
                        this.#paypalButton.textContent = ''
                        this.#paypalButton.classList.add('disabled')
                        this.#paymentComplete = true
                        document.getElementById(
                            'modal-button-text'
                        ).textContent = withLang({ en: 'close', fr: 'fermer' })
                        state.cart = () => []
                        state.order = {
                            name: orderData.payer.name.given_name,
                            email: orderData.payer.email_address,
                            id: orderData.purchase_units[0].payments.captures[0]
                                .id,
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
            this.#message.textContent = `Calculated Total: ${
                document.querySelector('#checkout-total').innerText
            }`
            parent.appendChild(template)
            return parent
        }
    }

    Object.assign(ZircusPayPal.prototype, withAsyncScript())

    customElements.get('zircus-paypal') ||
        customElements.define('zircus-paypal', ZircusPayPal)
}
