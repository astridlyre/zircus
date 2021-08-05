import { appendPreloadLink, ZircusElement } from '../utils.js'

export default () => {
    class Hero extends HTMLElement {
        connectedCallback() {
            // Images
            this._images = new Array(Number(this.getAttribute('num-images')))
                .fill('')
                .map((_, i) => `${this.getAttribute('image-path')}${i}.jpg`)
            this._images.forEach(image => appendPreloadLink(image))
            this._currentImage = 1

            this._imageEl = new ZircusElement('img', 'section__hero_image', {
                src: this._images[this._currentImage],
                alt: this.getAttribute('alt'),
                title: this.getAttribute('title'),
            })

            this._roundedBottom = new ZircusElement('div', [
                'bg-light',
                'rounded-big-top',
                'absolute',
                'b-0',
                'l-0',
            ])

            this.appendChild(this._imageEl.render())
            this.appendChild(this._roundedBottom.render())
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

    if (!customElements.get('zircus-hero-image'))
        customElements.define('zircus-hero-image', Hero)
}
