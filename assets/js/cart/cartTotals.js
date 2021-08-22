import { currency } from "../utils.js";

export default class ZircusCartTotals extends HTMLElement {
  #dom;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = Template.render();
    this.#dom = Template.mapDOM(this.shadowRoot);
  }

  attributeChangedCallback(name, _, newValue) {
    if (name.endsWith("label")) {
      this.#dom[name].textContent = `${newValue}:`;
    } else {
      this.#dom[name].textContent = currency(newValue);
    }
  }

  static get observedAttributes() {
    return [
      "subtotal-label",
      "subtotal",
      "shipping-label",
      "shipping",
      "tax-label",
      "tax",
      "total-label",
      "total",
    ];
  }
}

const Template = {
  render() {
    return `${this.html()}${this.css()}`;
  },
  html: () => `
  <ul>
    <li><span id="subtotal-label"></span><span id="subtotal"></span></li>
    <li><span id="tax-label"></span><span id="tax"></span></li>
    <li><span id="shipping-label"></span><span id="shipping"></span></li>
    <li><span id="total-label"></span><span id="total"></span></li>
  </ul>
  `,
  css: () => `
<style>
  :host {
    margin-top: var(--base-spacing);
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    flex-grow: 1;
  }
  ul {
    flex-basis: 12rem;
    flex-grow: 1;
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: var(--default-font-size);
    line-height: var(--doc-line-height);
    font-family: var(--site-font-family);
  }

  li {
    display: flex;
    justify-content: space-between;
  }

  #total-label, #total {
    font-weight: 600;
  }
</style>
  `,
  mapDOM: (scope) => ({
    "subtotal-label": scope.querySelector("#subtotal-label"),
    subtotal: scope.querySelector("#subtotal"),
    "shipping-label": scope.querySelector("#shipping-label"),
    shipping: scope.querySelector("#shipping"),
    "tax-label": scope.querySelector("#tax-label"),
    tax: scope.querySelector("#tax"),
    "total-label": scope.querySelector("#total-label"),
    total: scope.querySelector("#total"),
  }),
};

customElements.get("zircus-cart-totals") ||
  customElements.define("zircus-cart-totals", ZircusCartTotals);
