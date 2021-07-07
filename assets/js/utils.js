// Get an element
export const q = (x) => document.getElementById(x)
export const API_ENDPOINT =
    "https://zircus.herokuapp.com/api"
// export const API_ENDPOINT = 'http://localhost:3000/api'

// Handle updating number fields
export const numberInputHandler = (el, fn, max) => {
    const v = Math.round(Number(el.value))
    const m = max()
    const result = v < m ? (v <= 0 ? 1 : v) : m
    if (fn && typeof fn === "function") fn(result)
    return (el.value = result)
}

/*
    State class, exposes two functions, 'set' and 'get'.
    
    'set' takes a function as argument that sets the state to the
    return value.

    'get' returns the state from localStorage.

 */
class State {
    constructor() {
        this.__hooks = []
    }

    get hooks() {
        return this.__hooks
    }

    addHook(fn) {
        this.__hooks.push(fn)
        return this
    }

    get inv() {
        const inv = localStorage.getItem('inv')
        if (inv) return JSON.parse(inv)
        return []
    }

    set inv(fn) {
        localStorage.setItem('inv', JSON.stringify(fn(this.inv)))
        return this.update()
    }

    get countries() {
        const countries = localStorage.getItem('countries')
        if (countries) return JSON.parse(countries)
        return []
    }

    set countries(fn) {
        localStorage.setItem('countries', JSON.stringify(fn(this.countries)))
        return this.update()
    }

    set cart(fn) {
        localStorage.setItem('cart', JSON.stringify(fn(this.cart)))
        return this.update()
    }

    get cart() {
        const cart = localStorage.getItem('cart')
        if (cart) return JSON.parse(cart)
        return []
    }

    update() {
        this.hooks.forEach((hook) => hook({ cart: this.cart, inv: this.inv, countries: this.countries }))
        return this
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
            classes.forEach((c) => {
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
        this.children.forEach((child) => {
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

// Get Inventory to set max quantities of items
const getInventory = async () => {
    // const INVENTORY_URL = "http://localhost:3000/api/inv"
    const INVENTORY_URL = `${API_ENDPOINT}/inv`

    return await fetch(INVENTORY_URL)
        .then((data) => data.json())
        .then((data) => state.inv = () => [...data.cf, ...data.pf, ...data.ff])
        .catch((e) => {
            console.error("Unable to get inventory", e.message)
        })
}
getInventory()

// Get the list of countries
const getCountries = async () => {
    const endpoint = `${API_ENDPOINT}/countries`

    return await fetch(endpoint)
        .then((data) => data.json())
        .then((countries) => state.countries = () => countries)
        .catch((e) => {
            console.error("Unable to get countries", e.message)
        })
}
getCountries()

    // Randomly pick a heading for the homepage
    ; (() => {
        const tagLines = [
            "For your thunder down under",
            "Guard the crown jewels",
            "For your national treasure",
            "A luxury condo for your privates",
            "If you are here, you may be gay",
            "Protect and serve your genitals",
            "Contain your thunder in style",
            "A stylish shape for your bits",
            "One person's junk is another's treasure",
        ]
        const heading = q("home-heading")
        if (heading)
            heading.innerText = tagLines[Math.floor(Math.random() * tagLines.length)]
    })()
