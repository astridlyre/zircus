import { ZircusElement } from '../utils.js'

export default function inStockText() {
    class InStockText extends HTMLElement {
        constructor() {
            super()
            this.text = new ZircusElement('p', [
                'product__inputs_stock',
                'dot',
            ]).render()
            this.appendChild(this.text)
        }

        connectedCallback() {
            this.quantity = this.getAttribute('quantity')
        }

        inStock() {
            this.text.classList.add('in-stock')
            this.text.classList.remove('out-stock')
        }

        outStock() {
            this.text.classList.add('out-stock')
            this.text.classList.remove('in-stock')
        }

        attributeChangedCallback(name, _, newValue) {
            if (name === 'text') return (this.text.textContent = newValue)
            if (name === 'quantity')
                return Number(newValue) > 0 ? this.inStock() : this.outStock()
        }

        static get observedAttributes() {
            return ['text']
        }
    }

    if (!customElements.get('zircus-in-stock-text'))
        customElements.define('zircus-in-stock-text', InStockText)
}
