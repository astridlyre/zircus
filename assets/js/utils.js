// Get an element
export const q = x => document.getElementById(x)

// Handle updating number fields
export const numberInputHandler = (el, fn, max) => {
    const v = Math.round(Number(el.value))
    const m = max()
    const result = v < m ? v <= 0 ? 1 : v : m
    if (fn && typeof fn === "function") fn(result)
    return el.value = result
}

/*
    State class, exposes two functions, 'set' and 'get'.
    
    'set' takes a function as argument that sets the state to the
    return value.

    'get' returns the state from localStorage.

 */
class State {
    constructor() {
        this.__state = this.get()
    }

    set(fn) {
        this.__state = fn(this.__state)
        return this.update()
    }

    update() {
        localStorage.setItem('state', JSON.stringify(this.__state))
        return this
    }

    get() {
        const storedState = localStorage.getItem('state')
        if (storedState) return JSON.parse(storedState)
        return { cart: [], inv: [] }
    }
}

// Singleton
export const state = new State()

// Element class
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
