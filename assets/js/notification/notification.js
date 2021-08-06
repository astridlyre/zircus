import { state, ZircusElement } from '../utils.js'

/*
 * notification sets the state.notify function and performs
 * the DOM manipulation to show and hide notifications
 */

export default function notification() {
    class Notification extends HTMLElement {
        constructor() {
            super()
            this._isHidden = true
            this.notificationElement = this.querySelector('#notification')
            this.notificationContent = this.querySelector(
                '#notification-content'
            )
            this.closeButton = this.querySelector('#notification-close')
            this.closeButton.addEventListener('click', () => {
                this.setAttribute('show', false)
            })
        }

        connectedCallback() {
            state.setNotify(({ content, time = 4000 }) => {
                state.currentNotification &&
                    clearTimeout(state.currentNotification.id)

                state.currentNotification = {
                    content,
                    id: setTimeout(
                        () => this.setAttribute('show', false),
                        time
                    ),
                }

                this.setAttribute('show', true)

                this.addEventListener('mouseenter', () =>
                    clearTimeout(state.currentNotification.id)
                )

                this.addEventListener('mouseleave', () =>
                    setTimeout(
                        () => this.setAttribute('show', false),
                        time - time / 2
                    )
                )
            })
        }

        attributeChangedCallback(name, _, newValue) {
            if (name === 'show') this.isHidden = newValue === 'false'
        }

        get isHidden() {
            return this._isHidden
        }

        set isHidden(value) {
            this._isHidden = value
            this._isHidden ? this.hide() : this.show()
        }

        clear() {
            this.notificationContent.textContent = ''
        }

        show() {
            this.clear() // clear previous notification
            if (typeof state.currentNotification.content === 'string') {
                this.notificationContent.appendChild(
                    new ZircusElement('p', 'notification__text')
                        .addChild(state.currentNotification.content)
                        .render()
                )
            } else if (Array.isArray(state.currentNotification.content)) {
                state.currentNotification.content.forEach(el =>
                    this.notificationContent.append(el)
                )
            } else {
                this.notificationContent.textContent =
                    state.currentNotification.content
            }
            this.notificationElement.classList.remove('hidden')
        }

        hide() {
            state.currentNotification &&
                clearTimeout(state.currentNotification.id)
            this.notificationElement.classList.add('hidden')
            state.currentNotification = null
        }

        static get observedAttributes() {
            return ['show']
        }
    }

    customElements.get('zircus-notification') ||
        customElements.define('zircus-notification', Notification)
}
