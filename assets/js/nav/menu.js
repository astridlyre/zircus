import { state, switchClass } from '../utils.js'
import withCartQty from './withCartQty.js'

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
    const navScrollHandler = (nav, scrollState) => {
        const MIN_SCROLL = 100 // Min distance to scroll
        const handler = (a, b, fn) => callback =>
            switchClass(nav, a, b, [fn, callback])
        const setHidden = () => (navHidden = true)
        const setShow = () => (navHidden = false)
        const show = handler('slide-up', 'slide-down', setShow)
        const hide = handler('slide-down', 'slide-up', setHidden)
        const setNotThrottled = () => (navThrottled = false)

        let navThrottled = false
        let navHidden = false
        let navFocused = false

        return (hasFocus = false) => {
            const isScrollingUp =
                window.scrollY < MIN_SCROLL || scrollState.next().value <= 0
            if (hasFocus) return show(() => (navFocused = true))
            navFocused = false
            if (!navThrottled)
                setTimeout(() => {
                    // Show nav if focused
                    if (isScrollingUp && navHidden) return show(setNotThrottled)
                    // If not hidden and scrolling down, hide nav
                    if (!isScrollingUp && !navHidden)
                        return hide(setNotThrottled)
                }, 100)
            else navThrottled = true
        }
    }

    class NavMenu extends HTMLElement {
        constructor() {
            super()

            this.nav = this.querySelector('#nav')
            this.cartLink = this.querySelector('#cart-link')
            this.navScrollHandler = navScrollHandler(
                this.nav,
                NavMenu.scrollState()
            )
            this.nav.addEventListener('focusin', () =>
                this.navScrollHandler(true)
            )
            this.nav.addEventListener('focusout', () =>
                this.navScrollHandler(false)
            )

            document.addEventListener('scroll', () => {
                this.navScrollHandler()
            })
            this.updateCartLink([this.cartLink])
            state.addHook({
                hook: () => this.updateCartLink([this.cartLink]),
                key: 'cart',
            })
        }

        static *scrollState() {
            let prevPos = 0
            let currentPos = 0
            while (true) {
                ;[prevPos, currentPos] = [currentPos, window.scrollY]
                yield currentPos - prevPos
            }
        }
    }

    Object.assign(NavMenu.prototype, withCartQty())

    if (!customElements.get('nav-menu'))
        customElements.define('nav-menu', NavMenu)
}
