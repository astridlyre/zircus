import { state } from '../utils.js'

export default function withCartQty() {
    return {
        updateCartLink() {
            return state.cart.length > 0
                ? (this.cartLink.textContent = `${this.getAttribute(
                      'carttext'
                  )} (${state.cart.reduce(
                      (acc, item) => acc + item.quantity,
                      0
                  )})`)
                : (this.cartLink.textContent = this.getAttribute('carttext'))
        },
    }
}
