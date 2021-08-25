const ENV = window.location.hostname.includes("zircus")
  ? "production"
  : "development";

export const API_ENDPOINT = ENV === "production"
  ? "https://zircus.herokuapp.com/api"
  : "http://localhost:3000/api";

const ONE_DAY = 86_400_000;

class EventBus {
  #listeners;
  constructor() {
    this.#listeners = new Map();
  }

  addEventListener(event, callback) {
    this.#listeners.set(
      event,
      (this.#listeners.get(event) || new Set()).add(callback),
    );
  }

  dispatchEvent(customEvent) {
    this.#listeners.get(customEvent.type)?.forEach((callback) =>
      callback(customEvent)
    );
  }
}

// Event bus singleton
export const eventBus = new EventBus();

/*
 * State class, for centrally managing application state.
 *
 * _setModalFunction sets the function for showing a modal
 * _setNotificationFunction sets the function for showing a notification
 *
 * Various getters and setters exist for the necessary properties.
 *
 * If saved storage is older than ONE_DAY, localStorage is cleared during
 * initialization.
 *
 */
class State {
  #state;
  #lastUpdated;

  constructor() {
    this.#state = JSON.parse(localStorage.getItem("state")) || {};
    this.#lastUpdated = this.#state.lastUpdated;

    if (!this.#lastUpdated || Date.now() - this.#lastUpdated > ONE_DAY) {
      localStorage.clear();
      this.#set("lastUpdated", Date.now());
    }
  }

  #set(key, val) {
    this.#state[key] = val;
    localStorage.setItem("state", JSON.stringify(this.#state));
  }

  get COUNTRIES_UPDATED_EVENT() {
    return "state-countries-updated";
  }

  get countries() {
    return this.#state.countries || [];
  }

  set countries(fn) {
    this.#set("countries", fn(this.countries));
    eventBus.dispatchEvent(new CustomEvent(this.COUNTRIES_UPDATED_EVENT));
  }

  get secret() {
    return this.#state.secret || null;
  }

  set secret(secret) {
    this.#set("secret", secret);
  }

  get currentItem() {
    return this.#state.currentItem || null;
  }

  set currentItem(item) {
    this.#set("currentItem", item);
  }

  get order() {
    return this.#state.order || null;
  }

  set order(order) {
    this.#set("order", order);
  }
}

// Singleton
export const state = new State();

/*
 *   ZircusElement makes it easier to create basic DOM elements
 *
 *   takes a 'type' (ie. 'p', 'span', 'li', etc), an array
 *   of css 'classes', and an object of additional 'attributes'
 *   to set on the new element.
 */
export class ZircusElement {
  constructor(type, classes, attributes) {
    this.e = document.createElement(type);
    this.children = [];

    if (classes && Array.isArray(classes)) {
      classes.forEach((c) => {
        this.e.classList.add(c);
      });
    } else if (classes && typeof classes === "string") {
      this.e.classList.add(classes);
    }

    if (attributes) {
      Object.entries(attributes).forEach(([key, val]) =>
        this.e.setAttribute(key, val)
      );
    }
  }
  render() {
    this.children.forEach((child) => {
      if (child instanceof ZircusElement) {
        this.e.appendChild(child.render());
      } else {
        this.e.textContent = child;
      }
    });
    return this.e;
  }

  event(ev, func) {
    this.e.addEventListener(ev, func);
    return this;
  }

  addChild(e) {
    this.children.push(e);
    return this;
  }
}

export function appendPreloadLinks(
  links,
  fragment = new DocumentFragment(),
  target = document.head,
) {
  links.forEach((link) => {
    fragment.appendChild(
      new ZircusElement("link", null, {
        href: link,
        rel: "prefetch",
        as: "image",
      }).render(),
    );
  });
  return target.appendChild(fragment);
}

export function setAttributes(el, attrs) {
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

// Simple tax rate calculator - IMPROVE THIS!!
export function calculateTax(country, state) {
  if (country === "Canada") {
    switch (state) {
      case "New Brunswick":
      case "Newfoundland and Labrador":
      case "Nova Scotia":
      case "Prince Edward Island":
        return 0.15;
      case "Ontario":
        return 0.13;
      default:
        return 0.05;
    }
  } else { // US Tax rate??
    return 0.07;
  }
}

export function notifySuccess(content) {
  if (typeof content === "string") {
    content = [
      new ZircusElement("span", ["notification__prefix", "green"])
        .addChild("!")
        .render(),
      new ZircusElement("p", "notification__text")
        .addChild(content)
        .render(),
    ];
  } else if (content instanceof ZircusElement) {
    content = [content];
  }
  return eventBus.dispatchEvent(
    new CustomEvent("notification", {
      detail: {
        content,
      },
    }),
  );
}

export function notifyFailure(content) {
  return eventBus.dispatchEvent(
    new CustomEvent("notification", {
      detail: {
        content: [
          new ZircusElement("span", ["notification__prefix", "red"])
            .addChild("!")
            .render(),
          new ZircusElement("p", ["notification__text"])
            .addChild(content)
            .render(),
        ],
      },
    }),
  );
}

export function lang() {
  return document.documentElement.getAttribute("lang");
}

export function withLang(obj) {
  return obj[lang()];
}

export function currency(num) {
  return new Intl.NumberFormat(`${lang()}-CA`, {
    style: "currency",
    currency: "CAD",
  }).format(num);
}

export function withLangUnits(unit) {
  return new Intl.NumberFormat(`${lang()}-CA`, {
    style: "unit",
    unit,
    unitDisplay: "short",
  });
}

// This was an API call, but with just two countries it seems unnecessary, so
// for now it is hardcoded.
const countries = {
  Canada: {
    states: [
      {
        id: 872,
        name: "Alberta",
        state_code: "AB",
      },
      {
        id: 875,
        name: "British Columbia",
        state_code: "BC",
      },
      {
        id: 867,
        name: "Manitoba",
        state_code: "MB",
      },
      {
        id: 868,
        name: "New Brunswick",
        state_code: "NB",
      },
      {
        id: 877,
        name: "Newfoundland and Labrador",
        state_code: "NL",
      },
      {
        id: 878,
        name: "Northwest Territories",
        state_code: "NT",
      },
      {
        id: 874,
        name: "Nova Scotia",
        state_code: "NS",
      },
      {
        id: 876,
        name: "Nunavut",
        state_code: "NU",
      },
      {
        id: 866,
        name: "Ontario",
        state_code: "ON",
      },
      {
        id: 871,
        name: "Prince Edward Island",
        state_code: "PE",
      },
      {
        id: 873,
        name: "Quebec",
        state_code: "QC",
      },
      {
        id: 870,
        name: "Saskatchewan",
        state_code: "SK",
      },
      {
        id: 869,
        name: "Yukon",
        state_code: "YT",
      },
    ],
  },
  "United States": {
    states: [
      {
        id: 1456,
        name: "Alabama",
        state_code: "AL",
      },
      {
        id: 1400,
        name: "Alaska",
        state_code: "AK",
      },
      {
        id: 1424,
        name: "American Samoa",
        state_code: "AS",
      },
      {
        id: 1434,
        name: "Arizona",
        state_code: "AZ",
      },
      {
        id: 1444,
        name: "Arkansas",
        state_code: "AR",
      },
      {
        id: 1402,
        name: "Baker Island",
        state_code: "UM-81",
      },
      {
        id: 1416,
        name: "California",
        state_code: "CA",
      },
      {
        id: 1450,
        name: "Colorado",
        state_code: "CO",
      },
      {
        id: 1435,
        name: "Connecticut",
        state_code: "CT",
      },
      {
        id: 1399,
        name: "Delaware",
        state_code: "DE",
      },
      {
        id: 1437,
        name: "District of Columbia",
        state_code: "DC",
      },
      {
        id: 1436,
        name: "Florida",
        state_code: "FL",
      },
      {
        id: 1455,
        name: "Georgia",
        state_code: "GA",
      },
      {
        id: 1412,
        name: "Guam",
        state_code: "GU",
      },
      {
        id: 1411,
        name: "Hawaii",
        state_code: "HI",
      },
      {
        id: 1398,
        name: "Howland Island",
        state_code: "UM-84",
      },
      {
        id: 1460,
        name: "Idaho",
        state_code: "ID",
      },
      {
        id: 1425,
        name: "Illinois",
        state_code: "IL",
      },
      {
        id: 1440,
        name: "Indiana",
        state_code: "IN",
      },
      {
        id: 1459,
        name: "Iowa",
        state_code: "IA",
      },
      {
        id: 1410,
        name: "Jarvis Island",
        state_code: "UM-86",
      },
      {
        id: 1428,
        name: "Johnston Atoll",
        state_code: "UM-67",
      },
      {
        id: 1406,
        name: "Kansas",
        state_code: "KS",
      },
      {
        id: 1419,
        name: "Kentucky",
        state_code: "KY",
      },
      {
        id: 1403,
        name: "Kingman Reef",
        state_code: "UM-89",
      },
      {
        id: 1457,
        name: "Louisiana",
        state_code: "LA",
      },
      {
        id: 1453,
        name: "Maine",
        state_code: "ME",
      },
      {
        id: 1401,
        name: "Maryland",
        state_code: "MD",
      },
      {
        id: 1433,
        name: "Massachusetts",
        state_code: "MA",
      },
      {
        id: 1426,
        name: "Michigan",
        state_code: "MI",
      },
      {
        id: 1438,
        name: "Midway Atoll",
        state_code: "UM-71",
      },
      {
        id: 1420,
        name: "Minnesota",
        state_code: "MN",
      },
      {
        id: 1430,
        name: "Mississippi",
        state_code: "MS",
      },
      {
        id: 1451,
        name: "Missouri",
        state_code: "MO",
      },
      {
        id: 1446,
        name: "Montana",
        state_code: "MT",
      },
      {
        id: 1439,
        name: "Navassa Island",
        state_code: "UM-76",
      },
      {
        id: 1408,
        name: "Nebraska",
        state_code: "NE",
      },
      {
        id: 1458,
        name: "Nevada",
        state_code: "NV",
      },
      {
        id: 1404,
        name: "New Hampshire",
        state_code: "NH",
      },
      {
        id: 1417,
        name: "New Jersey",
        state_code: "NJ",
      },
      {
        id: 1423,
        name: "New Mexico",
        state_code: "NM",
      },
      {
        id: 1452,
        name: "New York",
        state_code: "NY",
      },
      {
        id: 1447,
        name: "North Carolina",
        state_code: "NC",
      },
      {
        id: 1418,
        name: "North Dakota",
        state_code: "ND",
      },
      {
        id: 1431,
        name: "Northern Mariana Islands",
        state_code: "MP",
      },
      {
        id: 4851,
        name: "Ohio",
        state_code: "OH",
      },
      {
        id: 1421,
        name: "Oklahoma",
        state_code: "OK",
      },
      {
        id: 1415,
        name: "Oregon",
        state_code: "OR",
      },
      {
        id: 1448,
        name: "Palmyra Atoll",
        state_code: "UM-95",
      },
      {
        id: 1422,
        name: "Pennsylvania",
        state_code: "PA",
      },
      {
        id: 1449,
        name: "Puerto Rico",
        state_code: "PR",
      },
      {
        id: 1461,
        name: "Rhode Island",
        state_code: "RI",
      },
      {
        id: 1443,
        name: "South Carolina",
        state_code: "SC",
      },
      {
        id: 1445,
        name: "South Dakota",
        state_code: "SD",
      },
      {
        id: 1454,
        name: "Tennessee",
        state_code: "TN",
      },
      {
        id: 1407,
        name: "Texas",
        state_code: "TX",
      },
      {
        id: 1432,
        name: "United States Minor Outlying Islands",
        state_code: "UM",
      },
      {
        id: 1413,
        name: "United States Virgin Islands",
        state_code: "VI",
      },
      {
        id: 1414,
        name: "Utah",
        state_code: "UT",
      },
      {
        id: 1409,
        name: "Vermont",
        state_code: "VT",
      },
      {
        id: 1427,
        name: "Virginia",
        state_code: "VA",
      },
      {
        id: 1405,
        name: "Wake Island",
        state_code: "UM-79",
      },
      {
        id: 1462,
        name: "Washington",
        state_code: "WA",
      },
      {
        id: 1429,
        name: "West Virginia",
        state_code: "WV",
      },
      {
        id: 1441,
        name: "Wisconsin",
        state_code: "WI",
      },
      {
        id: 1442,
        name: "Wyoming",
        state_code: "WY",
      },
    ],
  },
};
// Set countries
state.countries = () => countries;

export function disableElements() {
  let els = [
    document.querySelector(
      "zircus-to-top-button",
    ),
    document.querySelector(
      "zircus-skip-button",
    ),
  ];

  [
    document.querySelector("#blur"),
    document.querySelector("zircus-desktop-menu"),
    document.querySelector("zircus-mobile-menu"),
    document.querySelector(".footer__container"),
  ].forEach((parent) => {
    els = els.concat([
      ...parent.querySelectorAll("textarea"),
      ...parent.querySelectorAll("input"),
      ...parent.querySelectorAll("button"),
      ...parent.querySelectorAll("select"),
      ...parent.querySelectorAll("a"),
    ]);
  });

  for (let i = 0; i < els.length; i++) {
    els[i].setAttribute("tabindex", -1);
  }

  return () => {
    for (let i = 0; i < els.length; i++) {
      els[i].removeAttribute("tabindex");
    }
  };
}

export async function isJson(data) {
  if (
    data.headers.has("content-type") &&
    data.headers.get("content-type").includes("application/json")
  ) {
    return Promise.resolve(await data.json());
  } else {
    return Promise.reject(`Data is not JSON: ${await data.text()}`);
  }
}

export function isError(data) {
  return new Promise((resolve, reject) => {
    if (data.error) {
      reject(data.error);
    } else {
      resolve(data);
    }
  });
}

export class Range {
  #min;
  #max;
  #step;

  constructor(min = 1, max = 1, step = 1) {
    this.#min = min;
    this.#max = max;
    this.#step = step;
  }

  normalize(num) {
    return num > this.#max ? this.#max : num < this.#min ? this.#min : num;
  }

  includes(num) {
    return num >= this.#min && num <= this.#max;
  }

  get min() {
    return this.#min;
  }

  get max() {
    return this.#max;
  }

  [Symbol.iterator] = function* (
    start = this.#step > 0 ? this.#min : this.#max,
  ) {
    const withinBound = (n) => this.#step > 0 ? n < this.#max : n > this.#min;
    while (withinBound(start)) yield start += this.#step;
  };
}

export function capitalize(word) {
  return `${word[0].toUpperCase()}${word.substring(1).toLowerCase()}`;
}
