import { q, state, ZircusElement } from '../utils.js'

export default function modal() {
    const blur = q('blur')
    const nav = q('nav')

    class Modal extends HTMLElement {
        constructor() {
            super()
            this._active = false
            this._isClear = true
        }

        connectedCallback() {
            this._heading = this.querySelector('#modal-heading')
            this._content = this.querySelector('#modal-content')
            this._ok = this.querySelector('#modal-ok')
            this._okText = this.querySelector('#modal-button-text')
            this._cancel = this.querySelector('#modal-cancel')
            this._spinner = this.querySelector('#modal-spinner')
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
            this._isClear = value
        }

        get isClear() {
            return this._isClear
        }

        set active({ value, spinning = false }) {
            this._active = value
            if (spinning) {
                this._okText.classList.add('hidden')
                this._spinner.classList.remove('hidden')
            } else if (!spinning) {
                this._okText.classList.remove('hidden')
                this._spinner.classList.add('hidden')
            }
            if (this.active) {
                this._ok.disabled = false
            } else {
                this._ok.disabled = true
            }
        }

        get active() {
            return this._active
        }

        clear() {
            this._heading.textContent = ''
            this._content.textContent = ''
            this._okText.textContent = ''
            this._cancel.textContent = ''
            state.modal = null
        }

        hide() {
            blur.classList.remove('blur')
            nav.classList.remove('blur')
            document.body.classList.remove('hide-y')
            this.classList.add('hidden')
        }

        show({ content, ok, heading, cancel }) {
            blur.classList.add('blur')
            nav.classList.add('blur')
            document.body.classList.add('hide-y')
            this.classList.remove('hidden')

            if (!this.isClear) return
            this._heading.textContent = heading

            if (typeof content === 'string')
                this._content.appendChild(
                    new ZircusElement('p', 'modal__text')
                        .addChild(content)
                        .render()
                )
            else if (content instanceof HTMLElement)
                this._content.appendChild(content)

            this._okText.textContent = ok.text
            this._ok.setAttribute('title', ok.title)
            this._ok.addEventListener('click', () => {
                ok.action({
                    setActive: value => (this.active = value),
                    close: () => this.hide(),
                    clear: () => this.clear(),
                    setCustomClose: cancel => {
                        this._cancel.textContent = cancel.text
                        this._cancel.setAttribute('title', cancel.title)
                    },
                })
            })

            if (cancel) {
                this._cancel.classList.remove('hidden')
                this._cancel.textContent = cancel.text
                this._cancel.setAttribute('title', cancel.title)
                this._cancel.addEventListener('click', () => {
                    cancel.action({
                        setActive: value => (this.active = value),
                        close: () => this.hide(),
                        clear: () => this.clear(),
                        setCustomClose: text =>
                            (this._cancel.textContent = text),
                    })
                })
                this._cancel.focus()
            } else {
                this._ok.focus()
                this._cancel.classList.add('hidden')
            }
        }

        attributeChangedCallback(name, _, newValue) {
            if (name === 'show' && newValue === 'true') {
                this.show(state.modal)
            } else if (name === 'show' && newValue === 'false') {
                ;() => this.hide()
            }
        }

        static get observedAttributes() {
            return ['show']
        }
    }

    customElements.get('zircus-modal') ||
        customElements.define('zircus-modal', Modal)
}
