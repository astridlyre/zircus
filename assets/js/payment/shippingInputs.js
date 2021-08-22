import {
  API_ENDPOINT,
  currency,
  isError,
  isJson,
  withLang,
  ZircusElement,
} from "../utils.js";

export default class ShippingInputs extends HTMLElement {
  #fieldset;
  #container;
  #quotes = [];
  #form;

  connectedCallback() {
    this.#form = document.querySelector("zircus-checkout-form");
    this.#fieldset = this.querySelector(
      "#checkout-shipping-inputs",
    );
    this.#fieldset.classList.add("hidden");
    this.#container = new ZircusElement("div", "flex-inputs").render();
    this.#form.addEventListener("filled", async ({ detail }) => {
      await this.fetchQuotes(detail);
    });
  }

  get isMounted() {
    console.log(this.#quotes.length > 0);
    return this.#quotes.length > 0;
  }

  async fetchQuotes(orderData) {
    await fetch(`${API_ENDPOINT}/orders/shipping`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    }).then(isJson).then(isError).then((quotes) => this.render(quotes));
  }

  render(quotes) {
    quotes.forEach((quote) => {
      const labelText = new ZircusElement("span", null)
        .addChild(
          `${quote.name} (${quote.details.days} days) - ${
            currency(quote.priceDetails.total)
          }`,
        )
        .render();

      const label = new ZircusElement("label", "row", {
        for: `shipping-${quote.code}`,
      }).render();

      const input = new ZircusElement("input", null, {
        type: "radio",
        name: "shipping",
        value: quote.code,
        "data-price": quote.priceDetails.total,
        id: `shipping-${quote.code}`,
      })
        .event("input", (event) => this.inputHandler(event, quote.code))
        .render();

      label.appendChild(input);
      label.appendChild(labelText);
      this.#container.appendChild(label);
    });
    this.#fieldset.appendChild(this.#container);
    this.#fieldset.classList.remove("hidden");
    this.dispatchEvent(new CustomEvent("mounted"));
  }

  get value() {
    return {
      method: this.getAttribute("shipping-type"),
      total: Number(this.getAttribute("shipping-price")),
    };
  }

  inputHandler(event, value) {
    if (event.target.checked) {
      this.setAttribute("shipping-type", value);
      this.setAttribute(
        "shipping-price",
        event.target.getAttribute("data-price"),
      );
      this.dispatchEvent(new CustomEvent("method-changed"));
    }
  }
}

customElements.get("zircus-shipping-inputs") ||
  customElements.define("zircus-shipping-inputs", ShippingInputs);
