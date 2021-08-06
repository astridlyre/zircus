import { state, ZircusElement } from '../utils.js'
import intText from './intText.js'

const notify = lang => {
    const title = intText.redirect[lang]
    const link = new ZircusElement('a', 'notification__text', {
        href: `/${lang}`,
        title,
    }).addChild(title)

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

export default function langRedirect() {
    // Redirect notification
    const lang = navigator.language
    const langInPath = location.pathname.includes(`/${lang}`)
    const wasNotified = !!localStorage.getItem('notified')

    // French
    if (/^fr\b/.test(lang) && !langInPath && !wasNotified) notify('fr')
}
