const q = x => document.getElementById(x)

const product = {
    productImage: q('product-image'),
    productQuantity: q('product-quantity'),
    productColor: q('product-color'),
    productType: q('product-type'),
    addToCart: q('add-to-cart'),
    quickPurchase: q('quick-purchase'),
}

class Underwear {
    constructor(prefix, imgPath, product) {
        this.imgs = {}
        this.e = product
        this.hovered = false
        for (const color of Underwear.colors) {
            const arr = []
            for (const view of Underwear.views) {
                arr.push(`${imgPath}${prefix}-${color}-${view}-1920.png`)
            }
            this.imgs[color] = arr
        }
        this.color = this.e.productColor.value
        this.e.productColor.addEventListener('change', () => this.changeColor(this.e.productColor.value))
        this.setImage(0)
        this.e.productImage.addEventListener('pointerover', () => this.hover(this.color))
        this.e.productImage.addEventListener('pointerleave', () => this.hover(this.color))
    }
    changeColor(color) {
        this.color = color
        return this.setImage(0)
    }
    hover(color) {
        console.log('hover')
        if (!this.hovered) {
            this.setImage(1)
            return this.hovered = true
        } else {
            this.setImage(0)
            return this.hovered = false
        }
    }
    setImage(n) {
        this.e.productImage.src = this.imgs[this.color][n]
        return this
    }
    static views = [
        'a', 'b'
    ]
    static colors = [
        'yellow',
        'purple',
        'teal',
        'black',
        'stripe'
    ]
}

function init(prefix) {
    return new Underwear(prefix, '/assets/img/products/masked/', product)
}

switch (product.productType?.value) {
    case 'ff':
        init('ff')
        break;
    case 'pf':
        init('pf')
        break;
    case 'cf':
        init('cf')
        break;
}
