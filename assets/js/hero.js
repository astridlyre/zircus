import { q } from './utils.js'

(function heroImage(image) {
    if (!image) {
        return
    }

    const imgPath = '/assets/img/people/'

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
