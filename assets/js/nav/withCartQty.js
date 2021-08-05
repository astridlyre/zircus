import { setTextContent, withLang, state } from '../utils.js'
import intText from '../int/intText.js'

export default function withCartQty() {
    const cartText = intText.nav.cartText
    return {
        updateCartLink(links) {
            if (state.cart.length > 0)
                setTextContent(
                    links,
                    `${withLang(cartText)} (${state.cart.reduce(
                        (acc, item) => acc + item.quantity,
                        0
                    )})`
                )
            else setTextContent(links, withLang(cartText))
        },
    }
}
