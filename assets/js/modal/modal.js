import { q, state, ZircusElement } from '../utils.js'

export default function modal() {
    const blur = q('blur')
    const nav = q('nav')

    class Modal extends HTMLElement {
        #isActive = false
        #modal
        #okText
        #okButton
        #cancelButton
        #content
        #heading
        #spinner
        #template

        connectedCallback() {
            this.#modal = new ZircusElement('div', 'modal__container').render()
            this.#template = this.querySelector('template')
            this.appendChild(this.#modal)
            state.setModal(modal => {
                this.show(modal)
                return {
                    setActive: value => (this.isActive = value),
                    close: () => this.hide(),
                }
            })
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
                this.#okButton.disabled = false
            } else {
                this.#okButton.disabled = true
            }
        }

        get isActive() {
            return this.#isActive
        }

        hide() {
            this.#modal.textContent = ''
            blur.classList.remove('blur')
            nav.classList.remove('blur')
            document.body.classList.remove('hide-y')
            this.classList.add('hidden')
        }

        show({ content, ok, heading, cancel }) {
            const template = this.#template.content.cloneNode(true)
            this.#heading = template.querySelector('#modal-heading')
            this.#content = template.querySelector('#modal-content')
            this.#okButton = template.querySelector('#modal-ok')
            this.#okText = template.querySelector('#modal-button-text')
            this.#cancelButton = template.querySelector('#modal-cancel')
            this.#spinner = template.querySelector('#modal-spinner')

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
            this.#okButton.setAttribute('title', ok.title)
            this.#okButton.addEventListener(
                'click',
                () => {
                    ok.action({
                        setActive: value => (this.isActive = value),
                        close: () => this.hide(),
                        setCustomClose: cancel => {
                            this.#cancelButton.textContent = cancel.text
                            this.#cancelButton.setAttribute(
                                'title',
                                cancel.title
                            )
                        },
                    })
                },
                { once: true }
            )

            blur.classList.add('blur')
            nav.classList.add('blur')
            document.body.classList.add('hide-y')
            this.classList.remove('hidden')
            this.#modal.appendChild(template)

            if (cancel) {
                this.#cancelButton.classList.remove('hidden')
                this.#cancelButton.textContent = cancel.text
                this.#cancelButton.setAttribute('title', cancel.title)
                this.#cancelButton.addEventListener(
                    'click',
                    () => {
                        cancel.action({
                            setActive: value => (this.isActive = value),
                            close: () => this.hide(),
                            setCustomClose: cancel => {
                                this.#cancelButton.textContent = cancel.text
                                this.#cancelButton.setAttribute(
                                    'title',
                                    cancel.title
                                )
                            },
                        })
                    },
                    { once: true }
                )
                this.#cancelButton.focus()
            } else {
                this.#okButton.focus()
            }
        }
    }

    customElements.get('zircus-modal') ||
        customElements.define('zircus-modal', Modal)
}
