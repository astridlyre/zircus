import routerLink from './routerLink.js'
import { lang } from '../utils.js'

const cache = new Map()

export default function router() {
    routerLink()
    class Router extends HTMLElement {
        #container
        #currentPage
        #lang

        connectedCallback() {
            this.#lang = lang()
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
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue === newValue) return
            if (name === 'page') {
                this.navigate(newValue)
                this.#currentPage.focus()
            }
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
            const newLang = newContent.getAttribute('lang')
            document.title = newContent.getAttribute('pagetitle')

            if (newLang === this.#lang) {
                this.#container.replaceChild(newContent, this.#currentPage)
            } else {
                document.documentElement.setAttribute('lang', newLang)
                this.#lang = newLang
                this.textContent = ''
                this.appendChild(wrapper.querySelector('zircus-router'))
                this.#container = this.querySelector('#blur')
            }
            this.#currentPage = newContent
            document.dispatchEvent(new CustomEvent('navigated'))
            return window.scrollTo({ top: 0 })
        }

        static get observedAttributes() {
            return ['page']
        }
    }

    customElements.get('zircus-router') ||
        customElements.define('zircus-router', Router)
}
