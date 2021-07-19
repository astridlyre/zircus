import { q, state, toggler, lang } from './utils.js'

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
    const nav = q('nav')
    const navLink = q('cart-link')
    const navLinkMobile = q('cart-link-mobile')
    const menu = q('menu-mobile-list')
    const btn = q('menu-mobile-btn')
    const skipBtn = q('skip-link')
    const mainContent = q('main-content')
    const cartText = {
        en: 'cart',
        fr: 'panier',
    }

    // Mobile menu functionality
    const menuFunc = (initial => {
        let hidden = initial
        const show = () => {
            menu.classList.add('hide')
            document.body.classList.remove('hide-y')
        }
        const hide = () => {
            menu.classList.remove('hide')
            document.body.classList.add('hide-y')
        }
        return () => {
            hidden = !hidden
            return hidden ? show() : hide()
        }
    })(true)

    // Returns a positive number for scrolling down and a negative for scrolling
    // up the document.
    function* scrollState() {
        let prevPos = 0
        let currentPos = 0
        while (true) {
            ;[prevPos, currentPos] = [currentPos, window.scrollY]
            yield currentPos - prevPos
        }
    }

    // Manages the scroll state of the nav menu and throttles scroll events to
    // not pelt the DOM with class adds and removes.
    const setMenuShown = (() => {
        const scrollingUp = scrollState()
        let menuThrottled = false
        let menuHidden = false
        return toggler(
            true,
            () =>
                window.scrollY < 100 || scrollingUp.next().value <= 0
                    ? true
                    : false,
            isScrollingUp => {
                if (!menuThrottled) {
                    setTimeout(() => {
                        if (isScrollingUp && menuHidden) {
                            nav.classList.add('slide-down')
                            nav.classList.remove('slide-up')
                            menuHidden = false
                        } else if (!isScrollingUp && !menuHidden) {
                            nav.classList.remove('slide-down')
                            nav.classList.add('slide-up')
                            menuHidden = true
                        }
                        menuThrottled = false
                    }, 100)
                } else {
                    menuThrottled = true
                }
            }
        )
    })()

    function updateNavLink() {
        if (state.cart.length > 0) {
            const totalItems = state.cart.reduce(
                (acc, item) => acc + item.quantity,
                0
            )
            navLink.textContent = `${cartText[lang()]} (${totalItems})`
            navLinkMobile.textContent = `${cartText[lang()]} (${totalItems})`
        } else {
            navLink.textContent = cartText[lang()]
            navLinkMobile.textContent = cartText[lang()]
        }
    }

    // set initial cart link state
    updateNavLink()

    // add mobile button event listener
    btn.addEventListener('click', menuFunc)
    skipBtn.addEventListener('click', () => {
        mainContent.focus()
    })

    // register update function with state hooks
    state.addHook(() => updateNavLink())
    document.addEventListener('scroll', () => setMenuShown())
}
