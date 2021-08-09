import withCartQty from './withCartQty.js'

const withScrollState = (prevPos, currentPos) => {
    function* scrollState() {
        while (true) {
            ;[prevPos, currentPos] = [currentPos, window.scrollY]
            yield currentPos - prevPos
        }
    }
    return { scrollState: scrollState() }
}

/*
 *   Menu for Zircus
 *
 *   createMenuFunc() creates the mobile menu functionality,
 *   toggling state from hidden to not hidden.
 *
 *   updateNavLink() sets the textContent of the Desktop and
 *   Mobile 'cart' nav link to the number of cart items.
 */
export default function menu() {
    class NavMenu extends HTMLElement {
        #MIN_SCROLL = 100
        #isThrottled = false
        #isHidden = false
        #isFocused = false
        #nav
        cartLink

        constructor() {
            super()
            this.#nav = this.querySelector('#nav')
            this.#nav.classList.add('slide-down') // show menu initially
            this.cartLink = this.querySelector('#cart-link')
        }

        connectedCallback() {
            this.updateCartLink() // set cart text
            this.#nav.addEventListener('focusin', () => (this.isFocused = true))
            this.#nav.addEventListener(
                'focusout',
                () => (this.isFocused = false)
            )
            document.addEventListener('scroll', () => {
                this.scrollHandler(
                    window.scrollY < this.#MIN_SCROLL ||
                        this.scrollState.next().value <= 0
                )
            })
            document.addEventListener('cart-updated', () =>
                this.updateCartLink()
            )
            document.addEventListener('navigated', () => {
                this.isHidden = false
            })
        }

        get isFocused() {
            return this.#isFocused
        }

        set isFocused(value) {
            this.#isFocused = value
            this.#isFocused || window.scrollY < this.#MIN_SCROLL
                ? this.show()
                : this.hide()
        }

        get isHidden() {
            return this.#isHidden
        }

        set isHidden(value) {
            this.#isHidden = value
            this.#isHidden ? this.hide() : this.show()
        }

        show() {
            this.#nav.classList.remove('slide-up')
            this.#isThrottled = false
        }

        hide() {
            this.#nav.classList.add('slide-up')
            this.#isThrottled = false
        }

        scrollHandler(isScrollingUp) {
            return !this.#isThrottled
                ? setTimeout(
                      () =>
                          isScrollingUp && this.isHidden
                              ? (this.isHidden = false)
                              : !isScrollingUp && !this.isHidden
                              ? (this.isHidden = true)
                              : false,
                      100
                  )
                : (this.#isThrottled = true)
        }
    }

    Object.assign(NavMenu.prototype, withCartQty(), withScrollState(0, 0))

    customElements.get('zircus-nav-desktop') ||
        customElements.define('zircus-nav-desktop', NavMenu)
}
