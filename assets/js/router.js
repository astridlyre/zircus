const cache = new Map()

export default function router() {
    class Router extends HTMLElement {
        #container
        #currentPage
        #isThrottled = false

        connectedCallback() {
            this.#container = this.querySelector('#blur')
            this.#currentPage = this.querySelector('main')

            window.addEventListener('popstate', () => this.changePage())
            document.addEventListener('pointerover', event => {
                let el = event.target
                while (el && !el.href) el = el.parentNode
                if (
                    el &&
                    !el.getAttribute('router-ignore') &&
                    !this.#isThrottled &&
                    !el.href.startsWith('mailto')
                ) {
                    this.preload(el.href)
                }
            })
            document.addEventListener('click', event => {
                if (event.ctrlKey) return
                let el = event.target
                while (el && !el.href) el = el.parentNode

                if (
                    el &&
                    !el.getAttribute('router-ignore') &&
                    !el.href.startsWith('mailto')
                ) {
                    event.preventDefault()
                    this.page = el.href
                }
            })
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
            this.#isThrottled = true
            if (cache.get(url))
                return setTimeout(() => (this.#isThrottled = false), 1000)
            const res = await fetch(url, {
                method: 'GET',
            })
            const text = await res.text()
            cache.set(url, text)
            this.#isThrottled = false
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
            document.documentElement.style.cursor = 'auto'
            return window.scrollTo({ top: 0 })
        }

        static get observedAttributes() {
            return ['page']
        }
    }

    customElements.get('zircus-router') ||
        customElements.define('zircus-router', Router)
}
