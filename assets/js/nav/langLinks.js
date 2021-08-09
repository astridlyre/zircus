import { ZircusElement, lang } from '../utils.js'

const icon = `
<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="icon"
>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path
    d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
    ></path>
</svg>
`

export default function langLinks() {
    class LangLinks extends HTMLElement {
        #links
        #button

        constructor() {
            super()
            this.#button = new ZircusElement('button', 'btn__icon').render()
            this.#button.innerHTML = icon
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
            this.#button.title = this.getAttribute('title')
            this.appendChild(this.#button)
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
