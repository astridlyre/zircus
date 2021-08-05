import { q, state } from '../utils.js'

const withShow = () => {
    const blur = q('blur')
    const nav = q('nav')
    const hide = () => {
        blur.classList.remove('blur')
        nav.classList.remove('blur')
        document.body.classList.remove('hide-y')
        document.querySelector('zircus-modal').setAttribute('show', 'false')
        state.modal = null
    }

    return {
        show({ heading, content, ok, cancel }) {
            blur.classList.add('blur')
            nav.classList.add('blur')
            document.body.classList.add('hide-y')
            this.classList.remove('hidden')
            this._heading.textContent = heading

            if (typeof content === 'string') this._content.textContent = content
            else if (content instanceof HTMLElement)
                this._content.appendChild(content)
            this._ok.textContent = ok.text
            this._ok.addEventListener('click', () => {
                ok.action(hide)
            })

            if (cancel) {
                this._cancel.classList.remove('hidden')
                this._cancel.textContent = cancel.text
                this._cancel.addEventListener('click', () => {
                    cancel.acton(hide)
                })
                this._cancel.focus()
            } else {
                this._ok.focus()
            }
        },
    }
}

class Modal extends HTMLElement {
    connectedCallback() {
        this._heading = this.querySelector('#modal-heading')
        this._content = this.querySelector('#modal-content')
        this._ok = this.querySelector('#modal-ok')
        this._cancel = this.querySelector('#modal-cancel')
    }

    hide() {
        this._cancel.classList.add('hidden')
        this._heading.textContent = ''
        this._content.textContent = ''
        this._ok.textContent = ''
        this._cancel.textContent = ''
        this.classList.add('hidden')
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

Object.assign(Modal.prototype, withShow())

if (!customElements.get('zircus-modal'))
    customElements.define('zircus-modal', Modal)

export default function showModal(modal) {
    state.modal = modal
    document.querySelector('zircus-modal').setAttribute('show', 'true')
}
