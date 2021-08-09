import { ZircusElement, lang } from '../utils.js'

export default function langLinks() {
    class LangLinks extends HTMLElement {
        #links
        #button

        constructor() {
            super()
            this.#links = new ZircusElement('ul', 'lang__list').render()
        }

        isActivePage(key) {
            const baseClasses = ['small-spaced-bold', 'border-hover']
            return key === lang() ? baseClasses.concat('active') : baseClasses
        }

        getLangLinks() {
            this.getAttribute('langs')
                .split(',')
                .map(lang => [
                    lang,
                    document.querySelector('main').getAttribute(lang),
                ])
                .forEach(([key, value]) => {
                    this.#links.appendChild(
                        new ZircusElement('li')
                            .addChild(
                                new ZircusElement('a', this.isActivePage(key), {
                                    href: value,
                                    'router-ignore': true,
                                }).addChild(key)
                            )
                            .render()
                    )
                })
        }

        connectedCallback() {
            this.#links.classList.add(this.getAttribute('type'))
            this.#button = new ZircusElement('button', 'btn__icon').render()
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
