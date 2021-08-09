import routerLink from './routerLink.js'

const cache = new Map()

export default function router() {
    routerLink()
    class Router extends HTMLElement {
        #container
        #currentPage

        connectedCallback() {
            this.#container = this.querySelector('#blur')
            this.#currentPage = this.querySelector('main')

            window.addEventListener('popstate', () => this.changePage())
            document.addEventListener('preload', event =>
                this.preload(event.detail)
            )
        }

        get page() {
            return this.getAttribute('page')
        }

        set page(value) {
            this.setAttribute('page', value)
            document.documentElement.style.cursor = 'wait'
            this.navigate(value)
            this.#currentPage.focus()
        }

        async preload(url) {
            if (cache.get(url)) return
            const res = await fetch(url, {
                method: 'GET',
            })
            const text = await res.text()
            cache.set(url, text)
        }

        navigate(href) {
            history.pushState(null, null, href)
            this.changePage()
        }

        async loadPage(url) {
            const cached = cache.get(url)
            if (cached) return Promise.resolve(cached)
            const res = await fetch(url, {
                method: 'GET',
            })
            const text = await res.text()
            cache.set(url, text)
            return Promise.resolve(text)
        }

        async changePage() {
            const res = await this.loadPage(window.location.href)
            const wrapper = document.createElement('div')
            wrapper.innerHTML = res
            const newContent = wrapper.querySelector('main')

            document.title = newContent.getAttribute('pagetitle')
            document.documentElement.setAttribute(
                'lang',
                newContent.getAttribute('lang')
            )
            this.#container.replaceChild(newContent, this.#currentPage)
            this.#currentPage = newContent
            document.dispatchEvent(new CustomEvent('navigated'))
            document.documentElement.style.cursor = 'unset'
            return window.scrollTo({ top: 0 })
        }

        static get observedAttributes() {
            return ['page']
        }
    }

    customElements.get('zircus-router') ||
        customElements.define('zircus-router', Router)
}
