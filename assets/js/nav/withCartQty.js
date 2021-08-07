import { withLang, state } from '../utils.js'
import intText from '../int/intText.js'

export default function withCartQty() {
    const cartText = intText.nav.cartText
    return {
        updateCartLink() {
            return state.cart.length > 0
                ? (this.cartLink.textContent = `${withLang(
                      cartText
                  )} (${state.cart.reduce(
                      (acc, item) => acc + item.quantity,
                      0
                  )})`)
                : (this.cartLink.textContent = withLang(cartText))
        },
    }
}
