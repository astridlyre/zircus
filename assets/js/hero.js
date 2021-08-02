import { appendPreloadLink, Element } from './utils.js'

export default () => {
    class Hero extends HTMLElement {
        constructor() {
            super()
            const numImages = Number(this.getAttribute('num-images'))
            const imagePath = this.getAttribute('image-path')
            this._images = new Array(numImages)
                .fill('')
                .map((_, i) => `${imagePath}${i}.jpg`)
            this._images.forEach(image => appendPreloadLink(image))
            this._currentImage = 1
            this._imageEl = new Element('img', ['section__hero_image'], {
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

            setInterval(
                () => this.setImage(this._images[this.getCurrentImage()]),
                5000
            )
        }

        getCurrentImage() {
            return this._currentImage === this._images.length
                ? (this._currentImage = 0)
                : this._currentImage++
        }

        setImage(src) {
            this._imageEl.src = src
        }
    }

    if (!customElements.get('hero-image'))
        customElements.define('hero-image', Hero)
}
