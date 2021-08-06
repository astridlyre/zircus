import product from './product/product.js'
import payment from './payment/payment.js'
import cart from './cart/cart.js'
import nav from './nav/nav.js'
import tagLine from './tagLine/tagLine.js'
import hero from './hero/hero.js'
import thanks from './thanks/thanks.js'
import contact from './contact/contact.js'
import notification from './notification/notification.js'
import { state, ZircusElement } from './utils.js'

product()
payment()
cart()
nav()
hero()
thanks()
contact()
notification()
tagLine()

// Redirect notification
if (
    /^fr\b/.test(navigator.language) &&
    !location.pathname.includes('/fr') &&
    !localStorage.getItem('notified')
) {
    const link = new ZircusElement('a', 'notification__text', {
        href: `/fr`,
        title: 'Visitez notre site en français',
    }).addChild('Visitez notre site en français?')

    const prefix = new ZircusElement('span', [
        'notification__prefix',
        'green',
    ]).addChild('?')

    state.notify({
        color: 'gray',
        time: 8000,
        content: [prefix.render(), link.render()],
    })

    localStorage.setItem('notified', JSON.stringify(true))
}
