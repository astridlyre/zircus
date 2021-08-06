import { state, switchClass, ZircusElement } from '../utils.js'

/*
 * notification sets the state.notify function and performs
 * the DOM manipulation to show and hide notifications
 */

export default function notification() {
    class Notification extends HTMLElement {
        attributeChangedCallback(name, _, newValue) {
            const notification = state.currentNotification
            if (!notification) return

            const content = this.querySelector('#notification-content')
            const button = this.querySelector('#notification-button')

            if (name === 'show' && newValue === 'true') {
                if (typeof notification.content === 'string') {
                    const p = new ZircusElement(
                        'p',
                        'notification__text'
                    ).addChild(notification.content)
                    content.appendChild(p.render())
                } else if (Array.isArray(notification.content))
                    notification.content.forEach(el => content.append(el))
                else content.appendChild(notification.content)
                button.addEventListener('click', notification.onClick)
                switchClass(button, 'hidden', notification.color)
            } else if (name === 'show' && newValue === 'false') {
                content.textContent = ''
                this.classList.remove(notification.color)
                switchClass(button, notification.color, 'hidden')
            }
        }

        static get observedAttributes() {
            return ['show']
        }
    }

    if (!customElements.get('zircus-notification'))
        customElements.define('zircus-notification', Notification)

    const notificationElement = document.querySelector('zircus-notification')
    if (!notificationElement) return // if not included on page, return
    const clear = () => notificationElement.setAttribute('show', 'false')
    const show = () => notificationElement.setAttribute('show', 'true')

    return state.setNotify(({ content, onClick, color }) => {
        state.currentNotification && clearTimeout(state.currentNotification.id)

        state.currentNotification = {
            content,
            color,
            id: setTimeout(clear, 4000),
            onClick,
        }

        show()

        notificationElement.addEventListener('mouseenter', () =>
            clearTimeout(state.currentNotification.id)
        )

        notificationElement.addEventListener('mouseleave', () =>
            setTimeout(clear, 2000)
        )
    })
}
