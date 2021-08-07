import { state } from '../utils.js'
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

        constructor() {
            super()
            this._isFocused = false
            this._isThrottled = false
            this._isHidden = false
            this.nav = this.querySelector('#nav')
            this.nav.classList.add('slide-down') // default to showing
            this.cartLink = this.querySelector('#cart-link')

            this.nav.addEventListener('focusin', () => (this.isFocused = true))
            this.nav.addEventListener(
                'focusout',
                () => (this.isFocused = false)
            )
            document.addEventListener('scroll', () => {
                this.scrollHandler(
                    window.scrollY < this.#MIN_SCROLL ||
                        this.scrollState.next().value <= 0
                )
            })

            this.updateCartLink() // set cart text
            document.addEventListener('cart-updated', () =>
                this.updateCartLink()
            )
        }

        get isThrottled() {
            return this._isThrottled
        }

        set isThrottled(value) {
            this._isThrottled = value
        }

        get isFocused() {
            return this._isFocused
        }

        set isFocused(value) {
            this._isFocused = value
            this._isFocused || window.scrollY < this.#MIN_SCROLL
                ? this.show()
                : this.hide()
        }

        get isHidden() {
            return this._isHidden
        }

        set isHidden(value) {
            this._isHidden = value
            this._isHidden ? this.hide() : this.show()
        }

        show() {
            this.nav.classList.replace('slide-up', 'slide-down')
            this.isThrottled = false
        }

        hide() {
            this.nav.classList.replace('slide-down', 'slide-up')
            this.isThrottled = false
        }

        scrollHandler(isScrollingUp) {
            return !this.isThrottled
                ? setTimeout(
                      () =>
                          isScrollingUp && this.isHidden
                              ? (this.isHidden = false)
                              : !isScrollingUp && !this.isHidden
                              ? (this.isHidden = true)
                              : false,
                      100
                  )
                : (this.isThrottled = true)
        }
    }

    Object.assign(NavMenu.prototype, withCartQty(), withScrollState(0, 0))

    customElements.get('zircus-nav-desktop') ||
        customElements.define('zircus-nav-desktop', NavMenu)
}
