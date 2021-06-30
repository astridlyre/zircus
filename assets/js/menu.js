import { q } from './utils.js'

(function() {
    class Menu {
        constructor() {
            this.menu = q('menu-mobile-list')
            this.btn = q('menu-mobile-btn')
            this.hidden = true

            this.btn.addEventListener('click', () => {
                this.hidden ? this.show() : this.hide()
            })

            this.menu.addEventListener('click', () => {
                this.hide()
            })
        }

        hide() {
            this.hidden = true
            this.menu.classList.add('hidden')
        }
        show() {
            this.hidden = false
            this.menu.classList.remove('hidden')
        }
    }

    return new Menu()
})()
