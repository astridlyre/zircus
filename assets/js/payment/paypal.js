import {
    lang,
    withLang,
    state,
    API_ENDPOINT,
    createNotificationFailure,
    createNotificationSuccess,
    ZircusElement,
} from '../utils.js'
import paypalIcon from './paypalIcon.js'

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
        #paypalLoaded = false

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
            this.#formElement.addEventListener('form-submit', event => {
                if (event.detail.method === 'paypal') {
                    return this.loadPaypal({ address: { country: 'Canada' } })
                        .then(res =>
                            res.ok
                                ? (this.#paypalLoaded = true)
                                : createNotificationFailure(res.error)
                        )
                        .then(() => {
                            this.#paypalLoaded
                                ? this.createPaymentIntent(
                                      event.detail.formData
                                  )
                                : createNotificationFailure(
                                      `PayPal not yet loaded: ${e.message}`
                                  )
                        })
                        .catch(e =>
                            createNotificationFailure(
                                `Form submit error: ${e.message}`
                            )
                        )
                }
            })
        }

        disconnectedCallback() {
            const scriptElement = document.getElementById('paypal-script')
            scriptElement && scriptElement.remove()
        }

        async loadPaypal({ address }) {
            return new Promise((resolve, reject) => {
                const scriptElement = new ZircusElement('script', null, {
                    src: `${src}&currency=${
                        address.country === 'Canada' ? 'CAD' : 'USD'
                    }&enable-funding=venmo`,
                    async: true,
                    type: 'text/javascript',
                    id: 'paypal-script',
                }).render()
                document.head.appendChild(scriptElement)
                scriptElement.addEventListener('load', () =>
                    resolve({ ok: true })
                )
                scriptElement.addEventListener('error', () =>
                    reject({ error: `Error loading PayPal script` })
                )
            }).catch(e =>
                createNotificationFailure(`Loading PayPal: ${e.message}`)
            )
        }

        async createPaymentIntent(formData) {
            const container = document.createElement('div')
            const template = this.#template.content.cloneNode(true)
            this.#text = template.querySelector('#paypal-text')
            this.#message = template.querySelector('#paypal-message')
            this.#text.textContent = withLang({
                en: 'Please continue payment through PayPal order page:',
                fr: 'Continuez votre order sur le site PayPal:',
            })
            this.#message.textContent = `Calculated Total: ${
                document.querySelector('#checkout-total').innerText
            }`
            container.appendChild(template)
            state.showModal({
                content: container,
                heading: this.getAttribute('name'),
                ok: {
                    text: this.getAttribute('canceltext'),
                    title: this.getAttribute('canceltext'),
                    action: ({ close }) => close(),
                },
            })
            requestAnimationFrame(() => {
                paypal
                    .Buttons({
                        style: paypalStyle,
                        createOrder: (data, actions) =>
                            this.createOrder(data, actions),
                        onApprove: (data, actions) =>
                            this.onApprove(data, actions),
                    })
                    .render('#paypal-button')
            })
        }

        createOrder(data, actions) {
            return actions.order.create({
                purchase_units: [
                    {
                        amount: {
                            value: state.cart.reduce(
                                (acc, item) => acc + item.price * item.quantity,
                                0
                            ),
                        },
                    },
                ],
            })
        }

        onApprove(data, actions) {
            return actions.order.capture().then(orderData => {
                console.log(
                    'Capture result',
                    orderData,
                    JSON.stringify(orderData, null, 2)
                )
                const transaction =
                    orderData.purchase_units[0].payments.captures[0]
                createNotificationSuccess(
                    `Transaction ${transaction.status}: ${transaction.id}`
                )
            })
        }
    }

    customElements.get('zircus-paypal') ||
        customElements.define('zircus-paypal', ZircusPayPal)
}
