// Wrapper to save typing
export const q = x => document.getElementById(x)

// Production API
export const API_ENDPOINT = 'https://zircus.herokuapp.com/api'

// Local Testing API
// export const API_ENDPOINT = 'http://localhost:3000/api'

/*
 * State class, exposes two functions, 'set' and 'get'.
 *
 * 'set' takes a function as argument that sets the state to the
 * return value.
 *
 * 'get' returns the state from localStorage.
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

    get secret() {
        const sec = localStorage.getItem('clientSecret')
        return sec ? JSON.parse(sec) : null
    }

    set secret(sec) {
        localStorage.setItem('clientSecret', JSON.stringify(sec))
    }

    set currentItem(item) {
        localStorage.setItem('currentItem', JSON.stringify(item))
    }

    get currentItem() {
        const currentItem = localStorage.getItem('currentItem')
        return currentItem ? JSON.parse(currentItem) : null
    }

    update() {
        this.hooks.forEach(hook =>
            hook({ cart: this.cart, inv: this.inv, countries: this.countries })
        )
        return this
    }
}

// Singleton
export const state = new State()

/*
 *   Element makes it easier to create basic DOM elements
 *
 *   takes a 'type' (ie. 'p', 'span', 'li', etc), an array
 *   of css 'classes', and an object of additional 'attributes'
 *   to set on the new element.
 */
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

// Simple toggler generator
export function toggler(initialState, stateFunc, func) {
    let value = initialState
    return () => func((value = stateFunc(value)))
}

// Simple tax rate calculator - IMPROVE THIS!!
export const calculateTax = (country, state) => {
    if (country === 'Canada') {
        switch (state) {
            case 'New Brunswick':
            case 'Newfoundland and Labrador':
            case 'Nova Scotia':
            case 'Prince Edward Island':
                return 0.15
            case 'Ontario':
                return 0.13
            default:
                return 0.05
        }
    } else {
        return 0.05
    }
}

// Get Inventory to set max quantities of items
const getInventory = async () => {
    return await fetch(`${API_ENDPOINT}/inv`)
        .then(data => data.json())
        .then(data => (state.inv = () => [...data.cf, ...data.pf, ...data.ff]))
        .catch(e => {
            console.error('Unable to get inventory', e.message)
        })
}
getInventory() // Get initial inventory
setInterval(getInventory, 300_000) // Check every 5 minutes

// Randomly pick a heading for the homepage, maybe get these from API at some
// point?
;(heading => {
    if (!heading) return
    const tagLines = [
        'For your thunder down under',
        'Guard the crown jewels',
        'For your national treasure',
        'A luxury condo for your privates',
        'If you are here, you may be gay',
        'Contain your thunder in style',
        'A stylish shape for your bits',
        "One person's junk is another's treasure",
    ]
    heading.innerText = tagLines[Math.floor(Math.random() * tagLines.length)]
})(q('home-heading'))

// This was an API call, but with just two countries it seems unnecessary, so
// for now it is hardcoded.
const countries = {
    Canada: {
        states: [
            {
                id: 872,
                name: 'Alberta',
                state_code: 'AB',
            },
            {
                id: 875,
                name: 'British Columbia',
                state_code: 'BC',
            },
            {
                id: 867,
                name: 'Manitoba',
                state_code: 'MB',
            },
            {
                id: 868,
                name: 'New Brunswick',
                state_code: 'NB',
            },
            {
                id: 877,
                name: 'Newfoundland and Labrador',
                state_code: 'NL',
            },
            {
                id: 878,
                name: 'Northwest Territories',
                state_code: 'NT',
            },
            {
                id: 874,
                name: 'Nova Scotia',
                state_code: 'NS',
            },
            {
                id: 876,
                name: 'Nunavut',
                state_code: 'NU',
            },
            {
                id: 866,
                name: 'Ontario',
                state_code: 'ON',
            },
            {
                id: 871,
                name: 'Prince Edward Island',
                state_code: 'PE',
            },
            {
                id: 873,
                name: 'Quebec',
                state_code: 'QC',
            },
            {
                id: 870,
                name: 'Saskatchewan',
                state_code: 'SK',
            },
            {
                id: 869,
                name: 'Yukon',
                state_code: 'YT',
            },
        ],
    },
    'United States': {
        states: [
            {
                id: 1456,
                name: 'Alabama',
                state_code: 'AL',
            },
            {
                id: 1400,
                name: 'Alaska',
                state_code: 'AK',
            },
            {
                id: 1424,
                name: 'American Samoa',
                state_code: 'AS',
            },
            {
                id: 1434,
                name: 'Arizona',
                state_code: 'AZ',
            },
            {
                id: 1444,
                name: 'Arkansas',
                state_code: 'AR',
            },
            {
                id: 1402,
                name: 'Baker Island',
                state_code: 'UM-81',
            },
            {
                id: 1416,
                name: 'California',
                state_code: 'CA',
            },
            {
                id: 1450,
                name: 'Colorado',
                state_code: 'CO',
            },
            {
                id: 1435,
                name: 'Connecticut',
                state_code: 'CT',
            },
            {
                id: 1399,
                name: 'Delaware',
                state_code: 'DE',
            },
            {
                id: 1437,
                name: 'District of Columbia',
                state_code: 'DC',
            },
            {
                id: 1436,
                name: 'Florida',
                state_code: 'FL',
            },
            {
                id: 1455,
                name: 'Georgia',
                state_code: 'GA',
            },
            {
                id: 1412,
                name: 'Guam',
                state_code: 'GU',
            },
            {
                id: 1411,
                name: 'Hawaii',
                state_code: 'HI',
            },
            {
                id: 1398,
                name: 'Howland Island',
                state_code: 'UM-84',
            },
            {
                id: 1460,
                name: 'Idaho',
                state_code: 'ID',
            },
            {
                id: 1425,
                name: 'Illinois',
                state_code: 'IL',
            },
            {
                id: 1440,
                name: 'Indiana',
                state_code: 'IN',
            },
            {
                id: 1459,
                name: 'Iowa',
                state_code: 'IA',
            },
            {
                id: 1410,
                name: 'Jarvis Island',
                state_code: 'UM-86',
            },
            {
                id: 1428,
                name: 'Johnston Atoll',
                state_code: 'UM-67',
            },
            {
                id: 1406,
                name: 'Kansas',
                state_code: 'KS',
            },
            {
                id: 1419,
                name: 'Kentucky',
                state_code: 'KY',
            },
            {
                id: 1403,
                name: 'Kingman Reef',
                state_code: 'UM-89',
            },
            {
                id: 1457,
                name: 'Louisiana',
                state_code: 'LA',
            },
            {
                id: 1453,
                name: 'Maine',
                state_code: 'ME',
            },
            {
                id: 1401,
                name: 'Maryland',
                state_code: 'MD',
            },
            {
                id: 1433,
                name: 'Massachusetts',
                state_code: 'MA',
            },
            {
                id: 1426,
                name: 'Michigan',
                state_code: 'MI',
            },
            {
                id: 1438,
                name: 'Midway Atoll',
                state_code: 'UM-71',
            },
            {
                id: 1420,
                name: 'Minnesota',
                state_code: 'MN',
            },
            {
                id: 1430,
                name: 'Mississippi',
                state_code: 'MS',
            },
            {
                id: 1451,
                name: 'Missouri',
                state_code: 'MO',
            },
            {
                id: 1446,
                name: 'Montana',
                state_code: 'MT',
            },
            {
                id: 1439,
                name: 'Navassa Island',
                state_code: 'UM-76',
            },
            {
                id: 1408,
                name: 'Nebraska',
                state_code: 'NE',
            },
            {
                id: 1458,
                name: 'Nevada',
                state_code: 'NV',
            },
            {
                id: 1404,
                name: 'New Hampshire',
                state_code: 'NH',
            },
            {
                id: 1417,
                name: 'New Jersey',
                state_code: 'NJ',
            },
            {
                id: 1423,
                name: 'New Mexico',
                state_code: 'NM',
            },
            {
                id: 1452,
                name: 'New York',
                state_code: 'NY',
            },
            {
                id: 1447,
                name: 'North Carolina',
                state_code: 'NC',
            },
            {
                id: 1418,
                name: 'North Dakota',
                state_code: 'ND',
            },
            {
                id: 1431,
                name: 'Northern Mariana Islands',
                state_code: 'MP',
            },
            {
                id: 4851,
                name: 'Ohio',
                state_code: 'OH',
            },
            {
                id: 1421,
                name: 'Oklahoma',
                state_code: 'OK',
            },
            {
                id: 1415,
                name: 'Oregon',
                state_code: 'OR',
            },
            {
                id: 1448,
                name: 'Palmyra Atoll',
                state_code: 'UM-95',
            },
            {
                id: 1422,
                name: 'Pennsylvania',
                state_code: 'PA',
            },
            {
                id: 1449,
                name: 'Puerto Rico',
                state_code: 'PR',
            },
            {
                id: 1461,
                name: 'Rhode Island',
                state_code: 'RI',
            },
            {
                id: 1443,
                name: 'South Carolina',
                state_code: 'SC',
            },
            {
                id: 1445,
                name: 'South Dakota',
                state_code: 'SD',
            },
            {
                id: 1454,
                name: 'Tennessee',
                state_code: 'TN',
            },
            {
                id: 1407,
                name: 'Texas',
                state_code: 'TX',
            },
            {
                id: 1432,
                name: 'United States Minor Outlying Islands',
                state_code: 'UM',
            },
            {
                id: 1413,
                name: 'United States Virgin Islands',
                state_code: 'VI',
            },
            {
                id: 1414,
                name: 'Utah',
                state_code: 'UT',
            },
            {
                id: 1409,
                name: 'Vermont',
                state_code: 'VT',
            },
            {
                id: 1427,
                name: 'Virginia',
                state_code: 'VA',
            },
            {
                id: 1405,
                name: 'Wake Island',
                state_code: 'UM-79',
            },
            {
                id: 1462,
                name: 'Washington',
                state_code: 'WA',
            },
            {
                id: 1429,
                name: 'West Virginia',
                state_code: 'WV',
            },
            {
                id: 1441,
                name: 'Wisconsin',
                state_code: 'WI',
            },
            {
                id: 1442,
                name: 'Wyoming',
                state_code: 'WY',
            },
        ],
    },
}

// Set countries
state.countries = () => countries
