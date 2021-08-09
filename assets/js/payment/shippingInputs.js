import { withLang, ZircusElement } from '../utils.js'

export default function shippingInputs({ shippingTypes }) {
    class ShippingInputs extends HTMLElement {
        connectedCallback() {
            this.inputsContainer = this.querySelector(
                '#checkout-shipping-inputs'
            )
            this.container = new ZircusElement('div', 'flex-inputs').render()
            Object.entries(shippingTypes).forEach(([key, type]) => {
                const text = new ZircusElement('span', null)
                    .addChild(
                        `${withLang(type.name)} - $${type.price.toFixed(2)}`
                    )
                    .render()

                const label = new ZircusElement('label', 'row', {
                    for: `shipping-${key}`,
                }).render()

                const input = new ZircusElement('input', null, {
                    type: 'radio',
                    name: 'shipping',
                    id: `shipping-${key}`,
                })
                    .event('input', event => this.inputHandler(event, key))
                    .render()

                if (type.default) {
                    this.setAttribute('shipping-type', key)
                    input.checked = true
                }

                label.appendChild(input)
                label.appendChild(text)
                this.container.appendChild(label)
            })
            this.inputsContainer.appendChild(this.container)
            this.dispatchEvent(new CustomEvent('mounted'))
        }

        get value() {
            return this.getAttribute('shipping-type')
        }

        inputHandler(event, value) {
            if (event.target.checked) {
                this.setAttribute('shipping-type', value)
                this.dispatchEvent(new CustomEvent('method-changed'))
            }
        }
    }

    customElements.get('zircus-shipping-inputs') ||
        customElements.define('zircus-shipping-inputs', ShippingInputs)
}
