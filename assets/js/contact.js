import { q, API_ENDPOINT } from './utils.js'

export default function contact() {
    const form = q('contact-form')
    if (!form) return
    const nameEl = q('contact-name')
    const emailEl = q('contact-email')
    const messageEl = q('contact-message')
    const sendMsg = q('contact-sent')
    const sendBtn = q('contact-button')
    const els = [nameEl, emailEl, messageEl, sendBtn]

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
        sendMsg.classList.remove('hidden')
        setTimeout(() => {
            els.forEach(el => {
                el.disabled = false
            })
            sendMsg.classList.add('hidden')
        }, 8000)
        fetch(`${API_ENDPOINT}/msg`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(e => console.log(e))
    })
}
