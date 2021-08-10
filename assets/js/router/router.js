import routerLink from './routerLink.js'
import { lang } from '../utils.js'

const cache = new Map()

export default function router() {
    routerLink()
    class Router extends HTMLElement {
        #currentPage
        #lang

        connectedCallback() {
            this.#lang = lang()
            this.#currentPage = this.querySelector('main')

            window.addEventListener('popstate', () =>
                this.setAttribute('page', window.location.href)
            )
            document.addEventListener('preload', event =>
                this.loadPage(event.detail)
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
                this.#currentPage?.focus()
            }
        }

        navigate(href) {
            history.pushState(null, null, href)
            this.changePage()
        }

        async loadPage(url, cached = cache.get(url)) {
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
            const { wrapper, newContent, lang, title } =
                this.extractContent(res)
            document.title = title
            return lang === this.#lang
                ? this.smallPageChange(newContent, this.querySelector('#blur'))
                : this.bigPageChange(
                      newContent,
                      wrapper.querySelector('#page'),
                      lang
                  )
        }

        extractContent(res, wrapper = document.createElement('div')) {
            wrapper.innerHTML = res
            const newContent = wrapper.querySelector('main')
            return {
                wrapper,
                newContent,
                lang: newContent.getAttribute('lang'),
                title: newContent.getAttribute('pagetitle'),
            }
        }

        notifyChanged(newContent) {
            this.#currentPage = newContent
            document.dispatchEvent(new CustomEvent('navigated'))
            return window.scrollTo({ top: 0 })
        }

        bigPageChange(newContent, page, lang) {
            document.documentElement.setAttribute('lang', lang)
            this.#lang = lang
            return requestAnimationFrame(() => {
                this.replaceChild(page, this.querySelector('#page'))
                return this.notifyChanged(newContent)
            })
        }

        smallPageChange(newContent, blur) {
            return requestAnimationFrame(() => {
                blur.replaceChild(newContent, this.#currentPage)
                return this.notifyChanged(newContent)
            })
        }

        static get observedAttributes() {
            return ['page']
        }
    }

    customElements.get('zircus-router') ||
        customElements.define('zircus-router', Router)
}
