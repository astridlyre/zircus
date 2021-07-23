import { q, state } from './utils.js'

/*
 * notification sets the state.notify function and performs
 * the DOM manipulation to show and hide notifications
 */

export default function notification() {
    const notificationEl = q('notification')
    if (!notificationEl) return
    const notificationText = q('notification-text')

    state.notify = (text, color) => {
        if (state.currentNotification) clearTimeout(state.currentNotification)
        notificationEl.classList.add(color)
        notificationText.textContent = text
        notificationEl.classList.remove('hidden')
        state.currentNotification = setTimeout(() => {
            notificationEl.classList.add('hidden')
            notificationEl.classList.remove(color)
            notificationText.textContent = ''
        }, 4000)
    }
}
