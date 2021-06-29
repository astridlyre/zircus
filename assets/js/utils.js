export const q = x => document.getElementById(x)
export const numberInputHandler = (el) => {
    const v = Math.round(Number(el.value))
    const result = v < 100 ? v : 100
    return el.value = result
}

class State {
    constructor() {
        this.__state = this.get()
    }

    add(item) {
        this.__state.push(item)
        this.update()
        return this
    }

    update(items) {
        if (items) this.__state = items
        localStorage.setItem('state', JSON.stringify(this.__state))
        return this
    }

    remove(item) {
        this.__state = this.__state.filter(i => i.id != item.id)
        this.update()
        return this
    }

    get() {
        const storedState = localStorage.getItem('state')
        if (storedState) return JSON.parse(storedState)
        return []
    }
}

export const state = new State()

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
