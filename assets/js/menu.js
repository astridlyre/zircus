import { q, state } from './utils.js'

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
    const navLink = q('cart-link')
    const navLinkMobile = q('cart-link-mobile')
    const menu = q('menu-mobile-list')
    const btn = q('menu-mobile-btn')
    const menuFunc = (initial => {
        let hidden = initial
        return () => {
            hidden = !hidden
            return hidden
                ? menu.classList.add('hide')
                : menu.classList.remove('hide')
        }
    })(true)

    function updateNavLink() {
        if (state.cart.length > 0) {
            const totalItems = state.cart.reduce(
                (acc, item) => acc + item.quantity,
                0
            )
            navLink.textContent = `cart (${totalItems})`
            navLinkMobile.textContent = `cart (${totalItems})`
        } else {
            navLink.textContent = 'cart'
            navLinkMobile.textContent = 'cart'
        }
    }

    // set initial cart link state
    updateNavLink()

    // add mobile button event listener
    btn.addEventListener('click', menuFunc)

    // register update function with state hooks
    state.addHook(() => updateNavLink())
}
