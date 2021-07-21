import { q, API_ENDPOINT } from './utils.js'
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
        fetch(`${API_ENDPOINT}/msg`, {
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
                console.log('wtf')
                if (data.error) {
                    showModal({
                        heading: 'Error',
                        text: data.error,
                        ok: {
                            text: 'ok',
                            fn: () => console.log('clicked ok'),
                        },
                    })
                } else {
                    showModal({
                        heading: 'Success!',
                        text: data.reply,
                        ok: {
                            text: 'ok',
                            fn: () => console.log('clicked ok'),
                        },
                    })
                }
            })
            .catch(e => console.log(e))
    })
}
