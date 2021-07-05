import { q, API_ENDPOINT, state, Element } from "./utils.js"
const stripe = Stripe("pk_test_51J93KzDIzwSFHzdzCZtyRcjMvw8em0bhnMrVmkBHaMFHuc2nkJ156oJGNxuz0G7W4Jx0R6OCy2nBXYTt6U8bSYew00PIAPcntP");

export const checkout = (() => {
    const placeOrder = q("place-order")
    if (!placeOrder) return
    if (state.cart.length === 0) location.assign('/')

    class Checkout {
        constructor() {
            this.name = q("checkout-name")
            this.email = q("checkout-email")
            this.streetAddress = q("checkout-street")
            this.city = q("checkout-city")
            this.state = q("checkout-state")
            this.stateText = q("checkout-state-text")
            this.country = q("checkout-country")
            this.zip = q("checkout-zip")
            this.zipText = q('checkout-zip-text')
            this.nav = q("nav")
            this.blur = q("blur")
            this.paymentModal = q("stripe-payment-modal")
            this.paymentForm = q("stripe-payment-form")
            this.payBtn = q("pay-button")
            this.cardError = q("card-error")
            this.spinner = q("spinner")
            this.btnText = q("button-text")
            this.placeOrder = q('place-order')
            this.checkoutForm = q('checkout-form')
            this.cancel = q('cancel')
            this.checkoutForm.addEventListener("submit", event => {
                event.preventDefault()
                this.createPaymentIntent()
            })
            this.cancel.addEventListener('click', () => this.showModal(false))
            // Add functionality for Countries States and Cities
            state.addHook((s) => {
                this.populateSelects(
                    this.country,
                    Object.keys(s.countries),
                    item => item
                )
                this.handleCountry()
            })
            this.country.addEventListener("input", () => this.handleCountry())
        }

        showModal(show) {
            this.loading(false)
            if (show) {
                document.body.classList.add('hide-y')
                this.nav.classList.add("blur")
                this.blur.classList.add("blur")
                this.paymentModal.style.display = "flex"
                this.payBtn.disabled = true
                q('payment-price').innerText = q('cart-total').innerText
            } else {
                document.body.classList.remove('hide-y')
                this.nav.classList.remove("blur")
                this.blur.classList.remove("blur")
                this.paymentModal.style.display = "none"
                if (state.cart.length === 0)
                    location.assign('/')
            }
        }

        async createPaymentIntent() {
            this.showModal(true)

            const cart = {
                name: this.name.value,
                email: this.email.value,
                streetAddress: this.streetAddress.value,
                city: this.city.value,
                state: this.state.value,
                country: this.country.value,
                zip: this.zip.value,
                items: this.items.map((item) => ({
                    type: item.type,
                    prefix: item.prefix,
                    size: item.size,
                    name: item.name,
                    color: item.color,
                    quantity: item.quantity,
                })),
            }

            fetch(`${API_ENDPOINT}/orders/create-payment-intent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cart),
            })
                .then((data) => data.json())
                .then((data) => this.loadStripe(data))
        }

        loadStripe(data) {
            const elements = stripe.elements()
            const style = {
                base: {
                    color: "#1a171b",
                    fontFamily: "Nunito, sans-serif",
                    fontSmoothing: "antialiased",
                    fontSize: "16px",
                    "::placeholder": {
                        color: "#1a171b",
                    },
                },
                invalid: {
                    fontFamily: "Nunito, sans-serif",
                    color: "#fa755a",
                    iconColor: "#fa755a",
                },
            }

            const card = elements.create("card", { style: style })
            card.mount("#card-element")
            card.on("change", (event) => {
                this.payBtn.disabled = event.empty
                this.cardError.textContent = event.error ? event.error.message : ""
            })

            this.paymentForm.addEventListener("submit", (event) => {
                event.preventDefault()
                this.payWithCard(stripe, card, data.clientSecret)
            })
        }

        payWithCard(stripe, card, clientSecret) {
            this.loading(true)
            stripe
                .confirmCardPayment(clientSecret, {
                    payment_method: { card },
                })
                .then((result) => {
                    if (result.error) return this.showError(result.error.message)
                    return this.orderComplete(result.paymentIntent.id)
                })
        }

        showError(msg) {
            this.loading(false)
            this.cardError.textContent = msg
            setTimeout(() => {
                this.cardError.textContent = ""
            }, 4000)
        }

        loading(isLoading) {
            if (isLoading) {
                this.payBtn.disabled = true
                this.spinner.classList.remove("hidden")
                this.btnText.classList.add("hidden")
            } else {
                this.payBtn.disabled = false
                this.spinner.classList.add("hidden")
                this.btnText.classList.remove("hidden")
            }
        }

        async orderComplete(id) {
            this.loading(false)
            return await fetch(`${API_ENDPOINT}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            })
                .then((res) => res.json())
                .then(() => {
                    state.clear()
                    q('result-message').classList.remove('hidden')
                    this.payBtn.disabled = true
                    this.cancel.innerText = 'close'
                    this.cancel.classList.add('btn__primary')
                    this.cancel.classList.remove('btn__secondary')
                })
        }

        populateSelects(select, data = [], fn) {
            select.textContent = ''
            data.forEach((item) => {
                select.appendChild(
                    new Element("option", null, {
                        value: fn(item),
                    }).addChild(fn(item)).render()
                )
            })
        }

        handleCountry() {
            const country = this.country.value
            this.state.textContent = ''
            this.populateSelects(this.state, state.countries[country].states, item => item.name)
            this.stateText.innerText = this.country.value === 'Canada' ? 'Province' : 'State'
            this.zipText.innerText = this.country.value === 'Canada' ? 'Postal Code' : 'Zip'
        }
    }

    return new Checkout()
})()
