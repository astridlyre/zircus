import { API_ENDPOINT, lang, state } from '../utils.js'
import intText from '../int/intText.js'

const { contactText } = intText

const handleFailure = error =>
    state.showModal({
        heading: contactText[lang()].error[0],
        content: error,
        ok: {
            text: contactText[lang()].error[1],
            title: contactText[lang()].error[2],
            action: hide => hide(),
        },
    })

const handleSuccess = data =>
    state.showModal({
        heading: contactText[lang()].default[0],
        content: contactText[lang()].message(data.name, data.email),
        ok: {
            text: contactText[lang()].default[1],
            title: contactText[lang()].default[2],
            action: hide => hide(),
        },
    })

export default function contact() {
    class ContactForm extends HTMLElement {
        connectedCallback() {
            this._form = this.querySelector('#contact-form')
            this._nameInput = this.querySelector('#contact-name')
            this._emailInput = this.querySelector('#contact-email')
            this._sendButton = this.querySelector('#contact-button')
            this._messageText = this.querySelector('#contact-message')

            const els = [
                this._nameInput,
                this._emailInput,
                this._sendButton,
                this._messageText,
            ]

            this._form.addEventListener('submit', e => {
                e.preventDefault()

                const message = {
                    name: this._nameInput.value,
                    email: this._emailInput.value,
                    message: this._messageText.value,
                }

                els.forEach(el => {
                    el.value = ''
                    el.disabled = true
                })

                fetch(`${API_ENDPOINT}/message`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(message),
                })
                    .then(res => res.json())
                    .then(data =>
                        data.error
                            ? handleFailure(data.error)
                            : handleSuccess(data)
                    )
                    .then(() => els.forEach(el => (el.disabled = false)))
                    .catch(e => console.log(e))
            })
        }
    }

    if (!customElements.get('zircus-contact-form'))
        customElements.define('zircus-contact-form', ContactForm)
}
