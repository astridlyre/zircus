import { q, Element } from './utils.js'

(function heroImage(image) {
    if (!image) {
        return
    }

    const imgPath = '/assets/img/people/'

    for (let i = 0; i < 6; i++) {
        const preload = new Element('link', null, {
            href: `/assets/img/people/hero${i}.jpg`,
            rel: 'prefetch',
            as: 'image'
        })
        document.head.appendChild(preload.render())
    }

    function setImage(n) {
        const path = `${imgPath}hero${n}.jpg`
        return image.src = path
    }

    function* getImageNumber(end) {
        let num = 0
        while (true) {
            if (num === end) (num = 0)
            yield ++num
        }
    }

    const counter = getImageNumber(5)

    setImage(counter.next().value)

    setInterval(() => {
        setImage(counter.next().value)
    }, 5000)

})(q('hero-image'))
