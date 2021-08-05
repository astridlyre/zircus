import { q, state, switchClass } from '../utils.js'

/*
 * notification sets the state.notify function and performs
 * the DOM manipulation to show and hide notifications
 */

export default function notification() {
    const notificationEl = q('notification')
    if (!notificationEl) return
    const notificationText = q('notification-text')

    function clearNotification(color) {
        notificationText.textContent = ''
        switchClass(notificationEl, color, 'hidden')
    }

    function showNotification(text, color) {
        notificationText.textContent = text
        switchClass(notificationEl, 'hidden', color)
    }

    state.setNotify((text, color, onClick) => {
        state.currentNotification && clearTimeout(state.currentNotification)
        showNotification(text, color)
        state.currentNotification = setTimeout(
            () => clearNotification(color),
            4000
        )

        notificationEl.addEventListener('mouseenter', () =>
            clearTimeout(state.currentNotification)
        )

        notificationEl.addEventListener('mouseleave', () =>
            setTimeout(() => clearNotification(), 2000)
        )

        notificationEl.onclick = () => onClick()
    })
}
