import { q } from './utils.js'

export default function modal() {
    const modalEl = q('modal')
    if (!modalEl) return
    const modalHeading = q('modal-heading')
    const modalText = q('modal-text')
    const modalOk = q('modal-ok')
    const modalCancel = q('modal-cancel')
    const blur = q('blur')
    const nav = q('nav')

    function showModal(modal) {
        if (!modal) return
        blur.classList.add('blur')
        nav.classList.add('blur')
        document.body.classList.add('hide-y')
        modalEl.classList.remove('hidden')
        modalHeading.textContent = modal.heading
        modalText.textContent = modal.text
        modalOk.textContent = modal.ok.text
        modalOk.addEventListener('click', () => {
            modal.ok.fn()
            hideModal()
        })

        if (modal.cancel) {
            modalCancel.classList.remove('hidden')
            modalCancel.textContent = modal.cancel.text
            modalCancel.addEventListener('click', () => {
                modal.cancel.fn()
                hideModal()
            })
            modalCancel.focus()
        } else {
            modalOk.focus()
        }
    }

    function hideModal() {
        blur.classList.remove('blur')
        nav.classList.remove('blur')
        document.body.classList.remove('hide-y')
        modalCancel.classList.add('hidden')
        modalEl.classList.add('hidden')
        modalHeading.textContent = ''
        modalText.textContent = ''
        modalOk.textContent = ''
        modalCancel.textContent = ''
    }

    return showModal
}
