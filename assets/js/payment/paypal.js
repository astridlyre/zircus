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

const paypalStyle = {
    shape: 'rect',
    color: 'black',
    layout: 'horizontal',
    label: 'paypal',
    height: 42,
}

export default function initPaypal() {
    class ZircusPayPal extends HTMLElement {
        #formElement
        #button
        #template
        #text
        #message
        #paypalButtonContainer

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
                    this.createPaymentIntent(event.detail.formData)
                }
            })
        }

        async createPaymentIntent(formData) {
            const container = document.createElement('div')
            const template = this.#template.content.cloneNode(true)
            this.#text = template.querySelector('#paypal-text')
            this.#message = template.querySelector('#paypal-message')
            this.#paypalButtonContainer =
                template.querySelector('#paypal-button')
            this.#text.textContent = withLang({
                en: 'Please continue payment through PayPal order page:',
                fr: 'Continuez votre order sur le site PayPal:',
            })
            container.appendChild(template)
            state.showModal({
                content: container,
                heading: this.getAttribute('heading'),
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
                            value: '77.44',
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
