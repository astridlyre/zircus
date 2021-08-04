import {
    q,
    state,
    toggler,
    withLang,
    switchClass,
    setTextContent,
} from './utils.js'

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
    const toTopBtn = q('back-to-top')
    const cartText = {
        en: 'cart',
        fr: 'panier',
    }

    // Mobile menu functionality
    const menuFunc = (() => {
        let hidden = false
        const show = () => {
            menu.classList.add('hide')
            document.body.classList.remove('hide-y')
        }
        const hide = () => {
            menu.classList.remove('hide')
            document.body.classList.add('hide-y')
        }
        return () => ((hidden = !hidden) ? hide() : show())
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

    const toTopBtnHandler = (() => {
        const MIN_SCROLL = 400

        function show() {
            toTopBtn.classList.add('show')
            return (btnHidden = false)
        }
        function hide() {
            toTopBtn.classList.remove('show')
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
    })()

    // Manages the scroll state of the nav menu and throttles scroll events to
    // not pelt the DOM with class adds and removes.
    const navScrollHandler = (() => {
        const MIN_SCROLL = 100 // Min distance to scroll
        const scroll = scrollState()
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
                window.scrollY < MIN_SCROLL || scroll.next().value <= 0
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
    })()

    function updateNavLink({ cart }) {
        if (cart.length > 0)
            setTextContent(
                [navLink, navLinkMobile],
                `${withLang(cartText)} (${cart.reduce(
                    (acc, item) => acc + item.quantity,
                    0
                )})`
            )
        else setTextContent([navLink, navLinkMobile], withLang(cartText))
    }

    // set initial cart link state
    updateNavLink({ cart: state.cart })

    // add mobile button event listener
    btn.addEventListener('click', menuFunc)
    skipBtn.addEventListener('click', () => {
        mainContent.focus()
    })
    menu.addEventListener('click', () => menuFunc())
    nav.addEventListener('focusin', () => navScrollHandler(true))
    nav.addEventListener('focusout', () => navScrollHandler(false))
    toTopBtn.addEventListener('click', () => {
        window.scroll({ top: 0 })
        toTopBtn.blur()
    })

    // register update function with state hooks
    state.addHook({ hook: updateNavLink, key: 'cart' })
    document.addEventListener('scroll', () => {
        navScrollHandler()
        toTopBtnHandler()
    })
}
