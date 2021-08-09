import { ZircusElement, lang } from '../utils.js'

export default function langLinks() {
    class LangLinks extends HTMLElement {
        #links

        constructor() {
            super()
            this.#links = new ZircusElement('ul', 'lang__list').render()
        }

        getLangLinks() {
            this.getAttribute('langs')
                .split(',')
                .map(lang => [
                    lang,
                    document.querySelector('main').getAttribute(lang),
                ])
                .forEach(([key, value]) => {
                    const li = document.createElement('li')
                    const link = document.createElement('zircus-router-link')
                    link.active = () => lang() === key
                    const a = new ZircusElement(
                        'a',
                        ['small-spaced-bold', 'border-hover'],
                        {
                            href: value,
                        }
                    ).addChild(key)
                    link.appendChild(a.render())
                    li.appendChild(link)
                    this.#links.appendChild(li)
                })
        }

        connectedCallback() {
            this.#links.classList.add(this.getAttribute('type'))
            this.appendChild(this.#links)
            this.getLangLinks()

            document.addEventListener('navigated', () => {
                this.#links.textContent = ''
                this.getLangLinks()
            })
        }
    }

    customElements.get('zircus-lang-links') ||
        customElements.define('zircus-lang-links', LangLinks)
}
