import { state, ZircusElement } from '../utils.js'

const DEFAULT_TIME = 4_000 // 4 seconds

/*
 * notification sets the state.notify function and performs
 * the DOM manipulation to show and hide notifications
 */

export default function notification() {
    class Notification extends HTMLElement {
        #currentNotification = null
        #notificationElement
        #notificationContent
        #closeButton

        connectedCallback() {
            this.#notificationElement = this.querySelector('#notification')
            this.#notificationContent = this.querySelector(
                '#notification-content'
            )
            this.#closeButton = this.querySelector('#notification-close')
            this.#closeButton.addEventListener('click', () => this.hide())
            this.addEventListener(
                'pointerenter',
                () =>
                    this.#currentNotification &&
                    clearTimeout(this.#currentNotification.id)
            )
            this.addEventListener(
                'pointerout',
                () =>
                    (this.#currentNotification.id = setTimeout(
                        () => this.clear(),
                        DEFAULT_TIME
                    ))
            )

            return state.setNotify(({ content, time = DEFAULT_TIME }) => {
                if (this.#currentNotification) {
                    clearTimeout(this.#currentNotification.id)
                    this.clear()
                }
                return this.show({
                    content,
                    id: setTimeout(() => this.clear(), time),
                })
            })
        }

        show({ content, id }) {
            return requestAnimationFrame(() => {
                if (typeof content === 'string') {
                    this.#notificationContent.appendChild(
                        new ZircusElement('p', 'notification__text')
                            .addChild(content)
                            .render()
                    )
                } else if (Array.isArray(content)) {
                    content.forEach(el => this.#notificationContent.append(el))
                } else {
                    this.#notificationContent.textContent = content
                }
                this.#notificationElement.classList.remove('hidden')
                this.#currentNotification = { content, id }
            })
        }

        clear() {
            return requestAnimationFrame(() => {
                this.#notificationContent.textContent = ''
                this.#notificationElement.classList.add('hidden')
                this.#currentNotification = null
            })
        }
    }

    customElements.get('zircus-notification') ||
        customElements.define('zircus-notification', Notification)
}
