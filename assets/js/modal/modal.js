import { q, state, ZircusElement } from '../utils.js'

export default function modal() {
    const blur = q('blur')
    const nav = q('nav')

    class Modal extends HTMLElement {
        #heading
        #content
        #ok
        #okText
        #cancel
        #spinner
        #isActive = false
        #isClear = true

        connectedCallback() {
            this.#heading = this.querySelector('#modal-heading')
            this.#content = this.querySelector('#modal-content')
            this.#ok = this.querySelector('#modal-ok')
            this.#okText = this.querySelector('#modal-button-text')
            this.#cancel = this.querySelector('#modal-cancel')
            this.#spinner = this.querySelector('#modal-spinner')
            state.setModal(modal => {
                this.show(modal)
                this.isClear = false
                return {
                    setActive: value => (this.active = value),
                    close: () => this.hide(),
                    clear: () => this.clear(),
                }
            })
        }

        set isClear(value) {
            this.#isClear = value
            this.#isClear && this.clear()
        }

        get isClear() {
            return this.#isClear
        }

        set isActive({ value, spinning = false }) {
            this.#isActive = value
            if (spinning) {
                this.#okText.classList.add('hidden')
                this.#spinner.classList.remove('hidden')
            } else if (!spinning) {
                this.#okText.classList.remove('hidden')
                this.#spinner.classList.add('hidden')
            }
            if (this.#isActive) {
                this.#ok.disabled = false
            } else {
                this.#ok.disabled = true
            }
        }

        get isActive() {
            return this.#isActive
        }

        clear() {
            this.#heading.textContent = ''
            this.#content.textContent = ''
            this.#okText.textContent = ''
            this.#cancel.textContent = ''
            state.modal = null
        }

        hide() {
            ;[(this.#heading, this.#ok, this.#cancel)].forEach(el =>
                el.setAttribute('aria-hidden', true)
            )
            blur.classList.remove('blur')
            nav.classList.remove('blur')
            document.body.classList.remove('hide-y')
            this.classList.add('hidden')
        }

        show({ content, ok, heading, cancel }) {
            ;[(this.#heading, this.#ok, this.#cancel)].forEach(el =>
                el.setAttribute('aria-hidden', true)
            )
            blur.classList.add('blur')
            nav.classList.add('blur')
            document.body.classList.add('hide-y')
            this.classList.remove('hidden')

            if (!this.isClear) return
            this.#heading.textContent = heading

            if (typeof content === 'string')
                this.#content.appendChild(
                    new ZircusElement('p', 'modal__text')
                        .addChild(content)
                        .render()
                )
            else if (content instanceof HTMLElement)
                this.#content.appendChild(content)

            this.#okText.textContent = ok.text
            this.#ok.setAttribute('title', ok.title)
            this.#ok.addEventListener('click', () => {
                ok.action({
                    setActive: value => (this.isActive = value),
                    close: () => this.hide(),
                    clear: () => this.clear(),
                    setCustomClose: cancel => {
                        this.#cancel.textContent = cancel.text
                        this.#cancel.setAttribute('title', cancel.title)
                    },
                })
            })

            if (cancel) {
                this.#cancel.classList.remove('hidden')
                this.#cancel.textContent = cancel.text
                this.#cancel.setAttribute('title', cancel.title)
                this.#cancel.addEventListener('click', () => {
                    cancel.action({
                        setActive: value => (this.isActive = value),
                        close: () => this.hide(),
                        clear: () => this.clear(),
                        setCustomClose: text =>
                            (this.#cancel.textContent = text),
                    })
                })
                this.#cancel.focus()
            } else {
                this.#ok.focus()
                this.#cancel.classList.add('hidden')
            }
        }

        attributeChangedCallback(name, _, newValue) {
            if (name === 'show' && newValue === 'true') {
                this.show(state.modal)
            } else if (name === 'show' && newValue === 'false') {
                this.#ok && this.hide()
            }
        }

        static get observedAttributes() {
            return ['show']
        }
    }

    customElements.get('zircus-modal') ||
        customElements.define('zircus-modal', Modal)
}
