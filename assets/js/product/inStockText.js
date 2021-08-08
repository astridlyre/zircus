import { ZircusElement, withLang } from '../utils.js'
import intText from '../int/intText.js'

export default function inStockText() {
    class InStockText extends HTMLElement {
        #text

        constructor() {
            super()
            this.#text = new ZircusElement('p', [
                'product__inputs_stock',
                'dot',
            ]).render()
            this.appendChild(this.#text)
        }

        inStock() {
            this.#text.classList.add('in-stock')
            this.#text.classList.remove('out-stock')
        }

        outStock() {
            this.#text.classList.add('out-stock')
            this.#text.classList.remove('in-stock')
        }

        set quantity(value) {
            this.setAttribute('quantity', value)
            this.#text.textContent = withLang(intText.product.stockText(value))
            return value > 0 ? this.inStock() : this.outStock()
        }

        get quantity() {
            return Number(this.getAttribute('quantity'))
        }
    }

    customElements.get('zircus-in-stock-text') ||
        customElements.define('zircus-in-stock-text', InStockText)
}
