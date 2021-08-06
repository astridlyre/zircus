import { withLang, lang, state, ZircusElement } from '../utils.js'
import intText from '../int/intText.js'

export default function CartProduct({
    productTemplate,
    updateSubtotal = null,
    renderCartProducts = null,
    item,
    withActions = false,
}) {
    const { removeBtnText, removeNotificationText } = intText.cart
    function createNotification(item) {
        const img = new ZircusElement('img', 'notification__image', {
            src: item.images.sm_a,
            alt: item.name,
        })

        const p = new ZircusElement('p').addChild(
            withLang(removeNotificationText(item))
        )

        return {
            content: [img.render(), p.render()],
            color: 'gray',
            onClick: () => location.assign(link.href),
        }
    }

    const template = productTemplate.content.cloneNode(true)
    const product = template.querySelector('.cart__product')
    const link = template.querySelector('a')
    const img = template.querySelector('img')
    const desc = template.querySelector('p')
    const price = template.querySelector('span')
    const qty = template.querySelector('.input')
    const label = template.querySelector('label')
    const removeBtn = template.querySelector('button')

    link.href = `/products/${item.name.en.toLowerCase().split(' ').join('-')}${
        lang() !== 'en' ? `-${lang()}` : ''
    }.html`
    link.addEventListener(
        'click',
        () =>
            (state.currentItem = {
                type: item.type,
                color: item.color,
                size: item.size,
            })
    )
    link.setAttribute('title', item.name[lang()])
    img.src = item.images.sm_a
    img.alt = `${item.name[lang()]} ${item.size} ${item.color} underwear`

    if (withActions) {
        desc.textContent = `${item.name[lang()]} (${item.size})`
        price.textContent = `$${item.price * item.quantity}`
        qty.value = item.quantity
        qty.id = item.type
        qty.setAttribute(
            'name',
            `${item.name[lang()]} ${item.size} ${item.color}`
        )
        label.setAttribute('for', item.type)
        qty.addEventListener('input', () => {
            if (!qty.value) qty.value = 1
            const max = state.inv.find(i => i.type === item.type).quantity
            if (Number(qty.value) > max) qty.value = max
            state.cart = cart =>
                cart.map(i =>
                    i.id === item.id ? { ...i, quantity: Number(qty.value) } : i
                )
            price.textContent = `$${item.price * Number(qty.value)}`
            removeBtn.setAttribute(
                'title',
                withLang(
                    removeBtnText({
                        ...item,
                        quantity: Number(qty.value),
                    })
                )
            )
            updateSubtotal()
        })

        // Add remove button functionality
        removeBtn.setAttribute('title', withLang(removeBtnText(item)))
        removeBtn.setAttribute('aria-label', withLang(removeBtnText(item)))
        removeBtn.addEventListener('click', () => {
            state.cart = cart => cart.filter(i => i.id !== item.id)
            product.remove()
            updateSubtotal()
            state.notify(createNotification(item))
            !state.cart.length && renderCartProducts()
        })
    } else {
        desc.textContent = `${item.name[lang()]} (${item.size}) x ${
            item.quantity
        }`
    }

    return template
}
