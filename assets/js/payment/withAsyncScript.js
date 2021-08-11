import { ZircusElement, createNotificationFailure } from '../utils.js'

export default function withAsyncScript() {
    return {
        async loadScript({ src, id, type = 'text/javascript', async = true }) {
            return new Promise((resolve, reject) => {
                const scriptElement = new ZircusElement('script', null, {
                    src,
                    async,
                    type,
                    id,
                }).render()
                document.head.appendChild(scriptElement)
                this.scriptElement = scriptElement
                scriptElement.addEventListener('load', () =>
                    resolve({ ok: true })
                )
                scriptElement.addEventListener('error', () =>
                    reject({ error: `Error loading script from ${src}` })
                )
            }).catch(e =>
                createNotificationFailure(`Script loading failed: ${e.message}`)
            )
        },
    }
}
