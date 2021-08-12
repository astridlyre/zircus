export default function checkoutForm() {
    class ZircusCheckoutForm extends HTMLElement {
        #form
        #handlers = new Set()

        getFormData() {
            return [...new FormData(this.#form).entries()].reduce(
                (obj, [key, val]) =>
                    key.startsWith('address-')
                        ? {
                              ...obj,
                              address: {
                                  ...obj.address,
                                  [key.replace('address-', '')]: val,
                              },
                          }
                        : {
                              ...obj,
                              [key]: val,
                          },
                { address: {} }
            )
        }

        connectedCallback() {
            this.#form = this.querySelector('form')
            this.#form.addEventListener('submit', event => {
                event.preventDefault()
                this.dispatchEvent(
                    new CustomEvent('form-submit', {
                        detail: {
                            paymentMethod: event.submitter.value,
                            formData: this.getFormData(),
                        },
                    })
                )
            })
        }

        set onSubmit(handler) {
            this.#handlers.add(handler)
        }

        get onSubmit() {
            return [...this.#handlers]
        }
    }

    customElements.get('zircus-checkout-form') ||
        customElements.define('zircus-checkout-form', ZircusCheckoutForm)
}
