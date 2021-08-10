import { state, ZircusElement } from '../utils.js'

/*
 * notification sets the state.notify function and performs
 * the DOM manipulation to show and hide notifications
 */

export default function notification() {
    class Notification extends HTMLElement {
        #isHidden = true
        #notificationElement
        #notificationContent
        #closeButton

        constructor() {
            super()
            this.#notificationElement = this.querySelector('#notification')
            this.#notificationContent = this.querySelector(
                '#notification-content'
            )
            this.#closeButton = this.querySelector('#notification-close')
            this.#closeButton.addEventListener('click', () => this.hide())
        }

        connectedCallback() {
            state.setNotify(({ content, time = 4000 }) => {
                state.currentNotification &&
                    clearTimeout(state.currentNotification.id)

                state.currentNotification = {
                    content,
                    id: setTimeout(() => (this.isHidden = true), time),
                }

                this.isHidden = false

                this.addEventListener(
                    'mouseenter',
                    () => clearTimeout(state.currentNotification.id),
                    { once: true }
                )

                this.addEventListener(
                    'mouseleave',
                    () =>
                        setTimeout(
                            () => (this.isHidden = true),
                            time - time / 2
                        ),
                    { once: true }
                )
            })
        }

        get isHidden() {
            return this.#isHidden
        }

        set isHidden(value) {
            this.#isHidden = value
            requestAnimationFrame(() =>
                this.#isHidden ? this.hide() : this.show()
            )
        }

        show() {
            this.#notificationContent.textContent = ''
            if (typeof state.currentNotification.content === 'string') {
                this.#notificationContent.appendChild(
                    new ZircusElement('p', 'notification__text')
                        .addChild(state.currentNotification.content)
                        .render()
                )
            } else if (Array.isArray(state.currentNotification.content)) {
                state.currentNotification.content.forEach(el =>
                    this.#notificationContent.append(el)
                )
            } else {
                this.#notificationContent.textContent =
                    state.currentNotification.content
            }
            this.#notificationElement.classList.remove('hidden')
        }

        hide() {
            state.currentNotification &&
                clearTimeout(state.currentNotification.id)
            this.#notificationElement.classList.add('hidden')
            state.currentNotification = null
        }
    }

    customElements.get('zircus-notification') ||
        customElements.define('zircus-notification', Notification)
}
