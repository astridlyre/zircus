const toTopBtnHandler = button => {
    const MIN_SCROLL = 400

    function show() {
        button.classList.add('show')
        return (btnHidden = false)
    }
    function hide() {
        button.classList.remove('show')
        return (btnHidden = true)
    }

    let btnHidden = true
    let btnFocused = false
    let btnThrottled = false

    return () =>
        !btnThrottled
            ? setTimeout(() => {
                  const shouldShow = window.scrollY > MIN_SCROLL
                  if (btnFocused && btnHidden) show()
                  if (shouldShow && btnHidden) show()
                  if (!shouldShow && !btnHidden) hide()
                  btnThrottled = false
              }, 100)
            : (btnThrottled = true)
}

export default function toTopButton() {
    class ToTopButton extends HTMLElement {
        constructor() {
            super()
            this.button = this.querySelector('#to-top-button')
            this.scrollHandler = toTopBtnHandler(this.button)
            this.button.addEventListener('click', () => {
                window.scroll({ top: 0 })
                this.button.blur()
            })
            document.addEventListener('scroll', this.scrollHandler)
        }
    }

    if (!customElements.get('to-top-button'))
        customElements.define('to-top-button', ToTopButton)
}
