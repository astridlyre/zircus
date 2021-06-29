export const q = x => document.getElementById(x)

export class Element {
    constructor(type, classes, attributes) {
        this.e = document.createElement(type)
        this.children = []

        if (classes) {
            classes.forEach(c => {
                this.e.classList.add(c)
            })
        }

        if (attributes) {
            for (const [key, val] of Object.entries(attributes)) {
                this.e.setAttribute(key, val)
            }
        }
    }
    render() {
        this.children.forEach(child => {
            if (child instanceof Element) {
                this.e.appendChild(child.render())
            } else {
                this.e.innerText = child
            }
        })
        return this.e
    }

    event(ev, func) {
        this.e.addEventListener(ev, () => func())
        return this
    }

    addChild(e) {
        this.children.push(e)
        return this
    }
}
