export default function toTopButton() {
    class ToTopButton extends HTMLElement {
        #MIN_SCROLL = 400
        #button
        #isHidden = true
        #isThrottled = false

        connectedCallback() {
            this.#button = this.querySelector('#to-top-button')
            this.#button.addEventListener('click', () => {
                window.scroll({ top: 0 })
                this.#button.blur()
            })
            document.addEventListener('scroll', () =>
                this.scrollHandler(window.scrollY > this.#MIN_SCROLL)
            )
        }

        get isHidden() {
            return this.#isHidden
        }

        set isHidden(value) {
            this.#isHidden = value
            this.#isHidden ? this.hide() : this.show()
        }

        show() {
            this.#button.classList.add('show')
            this.#isThrottled = false
        }

        hide() {
            this.#button.classList.remove('show')
            this.#isThrottled = false
        }

        scrollHandler(shouldShow) {
            !this.#isThrottled
                ? setTimeout(
                      () =>
                          shouldShow && this.isHidden
                              ? (this.isHidden = false)
                              : !shouldShow && !this.isHidden
                              ? (this.isHidden = true)
                              : false,
                      100
                  )
                : (this.#isThrottled = true)
        }
    }

    customElements.get('zircus-to-top-button') ||
        customElements.define('zircus-to-top-button', ToTopButton)
}
