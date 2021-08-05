export default function toTopButton() {
    class ToTopButton extends HTMLElement {
        #MIN_SCROLL = 400

        constructor() {
            super()
            this.button = this.querySelector('#to-top-button')
            this.buttonHidden = true
            this.buttonFocused = false
            this.throttled = false
        }

        connectedCallback() {
            this.button.addEventListener('click', () => {
                window.scroll({ top: 0 })
                this.button.blur()
            })
            document.addEventListener('scroll', this.scrollHandler())
        }

        show() {
            this.button.classList.add('show')
            this.buttonHidden = false
            this.throttled = false
        }

        hide() {
            this.button.classList.remove('show')
            this.buttonHidden = true
            this.throttled = false
        }

        scrollHandler() {
            return () =>
                !this.throttled
                    ? setTimeout(() => {
                          const shouldShow = window.scrollY > this.#MIN_SCROLL
                          if (this.buttonFocused && this.buttonHidden)
                              return this.show()
                          if (shouldShow && this.buttonHidden)
                              return this.show()
                          if (!shouldShow && !this.buttonHidden)
                              return this.hide()
                      }, 100)
                    : (this.throttled = true)
        }
    }

    if (!customElements.get('to-top-button'))
        customElements.define('to-top-button', ToTopButton)
}
