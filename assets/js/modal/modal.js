import { q, state, ZircusElement } from '../utils.js'

export default function modal() {
    const blur = q('blur')
    const nav = q('nav')

    class Modal extends HTMLElement {
        connectedCallback() {
            this._heading = this.querySelector('#modal-heading')
            this._content = this.querySelector('#modal-content')
            this._ok = this.querySelector('#modal-ok')
            this._cancel = this.querySelector('#modal-cancel')
            state.setModal(modal => this.show(modal))
        }

        hide() {
            blur.classList.remove('blur')
            nav.classList.remove('blur')
            document.body.classList.remove('hide-y')
            state.modal = null
            this._cancel.classList.add('hidden')
            this._heading.textContent = ''
            this._content.textContent = ''
            this._ok.textContent = ''
            this._cancel.textContent = ''
            this.classList.add('hidden')
        }

        show({ content, ok, heading, cancel }) {
            blur.classList.add('blur')
            nav.classList.add('blur')
            document.body.classList.add('hide-y')
            this.classList.remove('hidden')
            this._heading.textContent = heading

            if (typeof content === 'string')
                this._content.appendChild(
                    new ZircusElement('p', 'modal__text')
                        .addChild(content)
                        .render()
                )
            else if (content instanceof HTMLElement)
                this._content.appendChild(content)

            this._ok.textContent = ok.text
            this._ok.setAttribute('title', ok.title)
            this._ok.addEventListener('click', () => {
                ok.action(() => this.hide())
            })

            if (cancel) {
                this._cancel.classList.remove('hidden')
                this._cancel.textContent = cancel.text
                this._cancel.setAttribute('title', cancel.title)
                this._cancel.addEventListener('click', () => {
                    cancel.action(() => this.hide())
                })
                this._cancel.focus()
            } else {
                this._ok.focus()
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
