const cache = new Map()

export default function router() {
    class Router extends HTMLElement {
        #container
        #currentPage

        connectedCallback() {
            this.#container = this.querySelector('#blur')
            this.#currentPage = this.querySelector('main')

            window.addEventListener('popstate', () => this.changePage())
            document.addEventListener('pointerover', event => {
                let el = event.target
                while (el && !el.href) el = el.parentNode
                if (el && !el.getAttribute('router-ignore')) {
                    this.preload(el.href)
                }
            })
            document.addEventListener('click', event => {
                if (event.ctrlKey) return
                let el = event.target
                while (el && !el.href) el = el.parentNode

                if (el && !el.getAttribute('router-ignore')) {
                    event.preventDefault()
                    this.navigate(el.href)
                    this.#currentPage.focus()
                    return window.scrollTo({ top: 0 })
                }
            })
        }

        get href() {
            return this.getAttribute('href')
        }

        set href(value) {
            this.setAttribute('href', value)
            this.navigate(value)
        }

        async preload(url) {
            console.log('triggered')
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
        }

        static get observedAttributes() {
            return ['href']
        }
    }

    customElements.get('zircus-router') ||
        customElements.define('zircus-router', Router)
}
