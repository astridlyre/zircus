import { q } from './utils.js'

(function heroImage(image) {
    if (!image) {
        return
    }

    const imgPath = '/assets/img/people/'

    function setImage(n) {
        const path = `url('${imgPath}hero${n}.jpg');`
        return image.style.backgroundImage = path
    }

    function* getImageNumber(end) {
        let num = 0
        while (num < end) yield ++num
        if (num == end) (num = 0)
    }

    const counter = getImageNumber(6)

    setImage(counter.next().value)

    setInterval(() => {
        setImage(counter.next().value)
    }, 5000)

})(q('hero-image'))
