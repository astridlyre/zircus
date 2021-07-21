import { q, API_ENDPOINT, state, Element, calculateTax, lang } from './utils.js'
const stripe = Stripe(
    'pk_test_51J93KzDIzwSFHzdzCZtyRcjMvw8em0bhnMrVmkBHaMFHuc2nkJ156oJGNxuz0G7W4Jx0R6OCy2nBXYTt6U8bSYew00PIAPcntP'
)

const CANADA_POSTAL_CODE = /^[A-Za-z][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]$/
const US_ZIP_CODE = /^[0-9]{5}(-[0-9]{4})?$/

export default function payment() {
    const placeOrder = q('place-order')
    if (!placeOrder) return // if not on checkout page don't do anything
    if (state.cart.length === 0) location.assign('/')
    const name = q('checkout-name')
    const email = q('checkout-email')
    const streetAddress = q('checkout-street')
    const city = q('checkout-city')
    const stateEl = q('checkout-state')
    const stateElText = q('checkout-state-text')
    const countryEl = q('checkout-country')
    const zip = q('checkout-zip')
    const zipText = q('checkout-zip-text')
    const paymentModal = q('stripe-payment-modal')
    const paymentForm = q('stripe-payment-form')
    const payBtn = q('pay-button')
    const cardError = q('card-error')
    const spinner = q('spinner')
    const btnText = q('button-text')
    const checkoutForm = q('checkout-form')
    const cancel = q('cancel')
    const checkoutSubtotal = q('checkout-subtotal')
    const checkoutTax = q('checkout-tax')
    const checkoutTotal = q('checkout-total')
    const templateEl = q('checkout-product-template')
    const checkoutList = q('checkout-products')

    const formText = {
        Canada: {
            en: ['Province', 'Postal Code'],
            fr: ['Province', 'Code postal'],
        },
        'United States': {
            en: ['State', 'Zip'],
            fr: ['État', 'Code postal'],
        },
    }

    let isLoaded = false

    function loading(isLoading) {
        if (isLoading) {
            payBtn.disabled = true
            spinner.classList.remove('hidden')
            btnText.classList.add('hidden')
        } else {
            payBtn.disabled = false
            spinner.classList.add('hidden')
            btnText.classList.remove('hidden')
        }
    }

    function showError(msg) {
        loading(false)
        cardError.textContent = msg
        setTimeout(() => {
            cardError.textContent = ''
        }, 4000)
    }

    function setTotals() {
        // Tally up
        const subtotal = state.cart.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        )
        const tax = subtotal * calculateTax(countryEl.value, stateEl.value)
        const total = subtotal + tax

        // Set text
        checkoutSubtotal.innerText = `$${subtotal.toFixed(2)}`
        checkoutTax.innerText = `$${tax.toFixed(2)}`
        checkoutTotal.innerText = `$${total.toFixed(2)}`
    }

    function renderCartItems() {
        const fragment = new DocumentFragment()
        state.cart.forEach(item => {
            const template = templateEl.content.cloneNode(true)
            const link = template.querySelector('a')
            const img = template.querySelector('img')
            const desc = template.querySelector('p')
            const l = lang()

            link.href = `/products/${item.name.en
                .toLowerCase()
                .split(' ')
                .join('-')}${l !== 'en' ? `-${l}` : ''}.html`
            link.addEventListener(
                'click',
                () =>
                    (state.currentItem = {
                        type: item.type,
                        color: item.color,
                        size: item.size,
                    })
            )
            img.src = item.images.sm_a
            desc.textContent = `${item.name[l]} (${item.size}) - ${item.quantity} x $${item.price}`

            return fragment.appendChild(template)
        })
        checkoutList.appendChild(fragment)
    }

    function populateSelects(select, data = [], fn) {
        select.textContent = ''
        data.forEach(item => {
            select.appendChild(
                new Element('option', null, {
                    value: fn(item),
                })
                    .addChild(fn(item))
                    .render()
            )
        })
    }

    function showModal(show) {
        loading(false)
        if (show) {
            document.body.classList.add('hide-y')
            q('blur').classList.add('blur')
            paymentModal.classList.add('show-modal')
            payBtn.disabled = true
            q('payment-price').innerText = checkoutTotal.textContent
        } else {
            document.body.classList.remove('hide-y')
            q('blur').classList.remove('blur')
            paymentModal.classList.remove('show-modal')
            if (state.cart.length === 0) {
                if (lang() === 'fr') return location.assign('/fr/merci')
                return location.assign('/thanks')
            }
        }
    }

    async function createPaymentIntent() {
        showModal(true)
        loading(true)

        const req = {
            lang: lang(),
            update: state.secret,
            name: name.value,
            email: email.value,
            streetAddress: streetAddress.value,
            city: city.value,
            country: countryEl.value,
            state: stateEl.value,
            zip: zip.value,
            items: state.cart.map(item => ({
                images: item.images,
                type: item.type,
                prefix: item.prefix,
                size: item.size,
                name: item.name,
                color: item.color,
                quantity: item.quantity,
            })),
        }

        fetch(`${API_ENDPOINT}/orders/create-payment-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req),
        })
            .then(data => data.json())
            .then(data => {
                state.secret = data.clientSecret
                state.order = { id: data.id, name: data.name }
                q('payment-price').innerText = `$${data.total.toFixed(2)}`
                loadStripe(data)
                loading(false)
            })
    }

    function loadStripe(data) {
        if (isLoaded) return
        isLoaded = true
        const elements = stripe.elements()
        const style = {
            base: {
                color: '#1a171b',
                fontFamily: 'Nunito, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#1a171b',
                },
            },
            invalid: {
                fontFamily: 'Nunito, sans-serif',
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        }

        const card = elements.create('card', { style: style })
        card.mount('#card-element')
        card.on('change', event => {
            payBtn.disabled = event.empty
            cardError.textContent = event.error ? event.error.message : ''
        })

        paymentForm.addEventListener('submit', event => {
            event.preventDefault()
            payWithCard(stripe, card, data.clientSecret)
        })
    }

    function payWithCard(stripe, card, clientSecret) {
        loading(true)
        stripe
            .confirmCardPayment(clientSecret, {
                payment_method: { card },
            })
            .then(result => {
                if (result.error) return showError(result.error.message)
                return orderComplete()
            })
    }

    function orderComplete() {
        loading(false)
        state.cart = () => []
        state.secret = null
        q('result-message').classList.remove('hidden')
        payBtn.disabled = true
        cancel.innerText = 'close'
        cancel.classList.add('btn__primary')
        cancel.classList.remove('btn__secondary')
    }

    function handleCountry() {
        const country = countryEl.value
        stateEl.textContent = ''
        populateSelects(
            stateEl,
            state.countries[country].states,
            item => item.name
        )
        stateElText.innerText = formText[country][lang()][0]
        zipText.innerText = formText[country][lang()][1]
        zip.setAttribute(
            'pattern',
            country === 'Canada'
                ? CANADA_POSTAL_CODE.source
                : US_ZIP_CODE.source
        )
        zip.setAttribute('maxlength', country === 'Canada' ? '7' : '10')
        zip.setAttribute('size', country === 'Canada' ? '7' : '10')
        setTotals()
    }

    function normalizeZip(value) {
        const val = value.toUpperCase()
        if (countryEl.value === 'Canada') {
            if (val.length === 6 && CANADA_POSTAL_CODE.test(val))
                return val.substring(0, 3) + ' ' + val.substring(3, 6)
            return val
        } else {
            if (val.length === 6 && val[5] !== '-') return val.substring(0, 5)
            return val
        }
    }

    // Set totals
    setTotals()

    // Render Items
    renderCartItems()
    populateSelects(countryEl, Object.keys(state.countries), item => item)
    handleCountry()

    // Add event listeners
    checkoutForm.addEventListener('submit', event => {
        event.preventDefault()
        createPaymentIntent()
    })
    cancel.addEventListener('click', () => showModal(false))
    countryEl.addEventListener('input', () => handleCountry())
    stateEl.addEventListener('input', () => setTotals())
    zip.addEventListener('input', e => {
        e.target.value = normalizeZip(e.target.value, countryEl.value)
    })
}
