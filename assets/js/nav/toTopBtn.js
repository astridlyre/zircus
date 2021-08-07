export default function toTopButton() {
    class ToTopButton extends HTMLElement {
        #MIN_SCROLL = 400

        constructor() {
            super()
            this.button = this.querySelector('#to-top-button')
            this._isHidden = true
            this._isThrottled = false
        }

        connectedCallback() {
            this.button.addEventListener('click', () => {
                window.scroll({ top: 0 })
                this.button.blur()
            })
            document.addEventListener('scroll', () =>
                this.scrollHandler(window.scrollY > this.#MIN_SCROLL)
            )
        }

        get isHidden() {
            return this._isHidden
        }

        set isHidden(value) {
            this._isHidden = value
            this._isHidden ? this.hide() : this.show()
        }

        show() {
            this.button.classList.add('show')
            this._isThrottled = false
        }

        hide() {
            this.button.classList.remove('show')
            this._isThrottled = false
        }

        scrollHandler(shouldShow) {
            !this._isThrottled
                ? setTimeout(
                      () =>
                          shouldShow && this.isHidden
                              ? (this.isHidden = false)
                              : !shouldShow && !this.isHidden
                              ? (this.isHidden = true)
                              : false,
                      100
                  )
                : (this._isThrottled = true)
        }
    }

    customElements.get('zircus-to-top-button') ||
        customElements.define('zircus-to-top-button', ToTopButton)
}
