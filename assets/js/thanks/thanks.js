import { withLang, state, ZircusElement } from '../utils.js'

const thanksText = {
    en: (name, email, orderId) => `
<p>
Thanks, <span id="user-name">${name}</span>! Your order has been recieved and you
should get a confirmation email sent to <kbd id="user-email">${email}</kbd> within a
few minutes with your order information. Your order id is
<kbd id="order-id">${orderId}</kbd>. Once your order ships, you will recieve a
tracking number, along with a link to view the status of your order. For
customer support, or if you have any questions, please contact us at
<a href="mailto:support@zircus.ca">support@zircus.ca</a>.
</p>
`,
    fr: (name, email, orderId) => `
<p>
Merci, <span id="user-name">${name}</span>! Votre commande a été reçue et vous
devrait obtenir un courriel de confirmation (envoyé à
<span id="user-email">${email}</span>) dans quelques minutes avec vos informations
de commande. Votre numéro de commande est <kbd id="order-id">${orderId}</kbd>. Une
fois votre commande expédiée, vous recevrez un numéro de suivi, ainsi qu'un
lien pour voir l'état de votre commande. Dans le cas des soutien à la
clientèle, ou si vous avez des questions, veuillez nous contacter à
<a href="mailto:support@zircus.ca">support@zircus.ca</a>.
</p>
    `,
}

export default function thanks() {
    class Thanks extends HTMLElement {
        #text

        connectedCallback() {
            const { order } = state
            !order && (document.querySelector('zircus-router').page = '/')
            this.#text = new ZircusElement('p').render()
            this.#text.innerHTML = withLang(thanksText)(
                order.name,
                order.email,
                order.id
            )
            this.appendChild(this.#text)
        }
    }

    customElements.get('zircus-thanks') ||
        customElements.define('zircus-thanks', Thanks)
}
