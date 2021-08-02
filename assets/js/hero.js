import { q, appendPreloadLink } from './utils.js'

export default function hero() {
    // If no hero image, don't do anything
    const image = q('hero-image')
    if (!image) return

    // 6 images
    const NUM_IMAGES = 6
    const IMG_PATH = '/assets/img/people/'
    const setImage = n => (image.src = `${IMG_PATH}hero${n}.jpg`)

    // Preload images
    for (let i = 0; i < NUM_IMAGES; i++)
        appendPreloadLink(`/assets/img/people/hero${i}.jpg`)

    // Loop over images endlessly
    function* getImageNumber(end) {
        let num = 0
        while (true) {
            if (num === end) num = 0
            yield ++num
        }
    }

    const counter = getImageNumber(NUM_IMAGES - 1)

    // Set initial image
    setImage(counter.next().value)

    // Start looping
    setInterval(() => {
        setImage(counter.next().value)
    }, 5000)
}
