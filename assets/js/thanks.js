import { q, state } from './utils.js'

export default function thanks() {
    const orderIdEl = q('order-id')
    if (!orderIdEl) return
    if (!state.order) location.assign('/')
    const userNameEl = q('user-name')
    const userEmailEl = q('user-email')
    const order = state.order
    orderIdEl.textContent = order.id
    userNameEl.textContent = order.name.split(' ')[0]
    userEmailEl.textContent = order.email
}
