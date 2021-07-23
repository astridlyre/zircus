import { q, API_ENDPOINT, lang } from './utils.js'
import modal from './modal.js'

export default function contact() {
    const form = q('contact-form')
    if (!form) return
    const nameEl = q('contact-name')
    const emailEl = q('contact-email')
    const messageEl = q('contact-message')
    const sendBtn = q('contact-button')
    const els = [nameEl, emailEl, messageEl, sendBtn]
    const showModal = modal()

    const modalText = {
        en: {
            error: ['Error', 'ok'],
            default: ['Success', 'ok', 'cancel'],
            message: (name, email) =>
                `Thanks for your message, ${name}! We'll get back to you at ${email} as soon as possible.`,
        },
        fr: {
            error: ['Error', 'ok'],
            default: ['Succès', 'ok', 'annuler'],
            message: (name, email) =>
                `Merci pour votre message ${name}! Nous vous rappelleons à votre courriel ${email} dans les plus brefs délais.`,
        },
    }

    form.addEventListener('submit', e => {
        e.preventDefault()
        const payload = {
            name: nameEl.value,
            email: emailEl.value,
            message: messageEl.value,
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
            body: JSON.stringify(payload),
        })
            .then(res => res.json())
            .then(data => {
                els.forEach(el => {
                    el.disabled = false
                })
                if (data.error) {
                    showModal({
                        heading: modalText[lang()].error[0],
                        text: data.error,
                        ok: {
                            text: modalText[lang()].error[1],
                        },
                    })
                } else {
                    showModal({
                        heading: modalText[lang()].default[0],
                        text: modalText[lang()].message(data.name, data.email),
                        ok: {
                            text: modalText[lang()].default[1],
                        },
                    })
                }
            })
            .catch(e => console.log(e))
    })
}
