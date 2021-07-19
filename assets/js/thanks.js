import { q, state } from './utils.js'

export default function thanks() {
    const orderIdEl = q('order-id')
    if (!orderIdEl) return
    if (!state.order) location.assign('/')
    const userNameEl = q('user-name')

    orderIdEl.textContent = state.order.id
    userNameEl.textContent = state.order.name.split(' ')[0]
}
