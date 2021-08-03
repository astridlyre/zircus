import { q, state, toggler, withLang } from './utils.js'

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
    const menuFunc = (() => {
        let hidden = false
        const show = () => {
            hidden = false
            menu.classList.add('hide')
            document.body.classList.remove('hide-y')
        }
        const hide = () => {
            hidden = true
            menu.classList.remove('hide')
            document.body.classList.add('hide-y')
        }
        return shouldShow => {
            return shouldShow ? show() : hidden ? show() : hide()
        }
    })()

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
    const [setMenuShown, showMenu] = (() => {
        const scrollingUp = scrollState()
        const show = () => {
            nav.classList.add('slide-down')
            nav.classList.remove('slide-up')
            menuHidden = false
        }
        const hide = () => {
            nav.classList.remove('slide-down')
            nav.classList.add('slide-up')
            menuHidden = true
        }
        let menuThrottled = false
        let menuHidden = false
        let menuFocused = false
        return [
            toggler(
                true,
                () =>
                    window.scrollY < 100 || scrollingUp.next().value <= 0
                        ? true
                        : false,
                isScrollingUp => {
                    if (!menuThrottled) {
                        setTimeout(() => {
                            if ((isScrollingUp && menuHidden) || menuFocused)
                                show()
                            else if (!isScrollingUp && !menuHidden) hide()
                            menuThrottled = false
                        }, 100)
                    } else {
                        menuThrottled = true
                    }
                }
            ),
            hasFocus => {
                if (hasFocus) {
                    menuFocused = true
                    show()
                } else {
                    menuFocused = false
                }
            },
        ]
    })()

    function updateNavLink({ cart }) {
        if (cart.length > 0) {
            const totalItems = cart.reduce(
                (acc, item) => acc + item.quantity,
                0
            )
            navLink.textContent = `${withLang(cartText)} (${totalItems})`
            navLinkMobile.textContent = `${withLang(cartText)} (${totalItems})`
        } else {
            navLink.textContent = withLang(cartText)
            navLinkMobile.textContent = withLang(cartText)
        }
    }

    // set initial cart link state
    updateNavLink({ cart: state.cart })

    // add mobile button event listener
    btn.addEventListener('click', menuFunc)
    skipBtn.addEventListener('click', () => {
        mainContent.focus()
    })
    menu.addEventListener('click', () => menuFunc())
    nav.addEventListener('focusin', () => showMenu(true))
    nav.addEventListener('focusout', () => showMenu(false))

    // register update function with state hooks
    state.addHook({ hook: updateNavLink, key: 'cart' })
    document.addEventListener('scroll', () => setMenuShown())
}
