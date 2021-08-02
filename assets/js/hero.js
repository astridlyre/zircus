import { appendPreloadLink, Element } from './utils.js'

export default () => {
    class Hero extends HTMLElement {
        constructor() {
            super()
            // Images
            this._images = new Array(Number(this.getAttribute('num-images')))
                .fill('')
                .map((_, i) => `${this.getAttribute('image-path')}${i}.jpg`)
            this._images.forEach(image => appendPreloadLink(image))
            this._currentImage = 1
            this._imageEl = new Element('img', 'section__hero_image', {
                src: this._images[this._currentImage],
                alt: this.getAttribute('alt'),
                title: this.getAttribute('title'),
            }).render()
            this._roundedBottom = new Element('div', [
                'bg-light',
                'rounded-big-top',
                'absolute',
                'b-0',
                'l-0',
            ]).render()

            this.appendChild(this._imageEl)
            this.appendChild(this._roundedBottom)
            this.classList.add('section__hero')

            setInterval(() => {
                this._imageEl.src = this._images[this.getCurrentImage()]
            }, 4500)
        }

        getCurrentImage() {
            return this._currentImage === this._images.length - 1
                ? (this._currentImage = 0)
                : ++this._currentImage
        }
    }

    if (!customElements.get('hero-image'))
        customElements.define('hero-image', Hero)
}
