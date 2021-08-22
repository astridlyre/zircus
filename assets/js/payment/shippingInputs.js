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
  #form;
  #isMounted;

  connectedCallback() {
    this.#isMounted = false;
    this.#form = document.querySelector("zircus-checkout-form");
    this.#fieldset = this.querySelector(
      "#checkout-shipping-inputs",
    );
    this.#container = new ZircusElement("div", "flex-inputs").render();
    this.#container.innerHTML = Template.placeholder();
    this.#fieldset.appendChild(this.#container);
    this.#form.addEventListener("form-filled", async ({ detail }) => {
      this.#container.innerHTML = Template.spinner;
      await this.fetchQuotes(detail);
    });
    this.#form.addEventListener(
      "form-not-filled",
      () => this.#container.innerHTML = Template.placeholder(),
    );
  }

  get isMounted() {
    return this.#isMounted;
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
    this.#container.textContent = "";
    quotes.forEach((quote, i) => {
      const labelText = new ZircusElement("span", null)
        .addChild(
          `${quote.serviceName} ${
            quote.serviceStandard.expectedTransitTime
              ? `(${quote.serviceStandard.expectedTransitTime} ${
                withLang({ en: "days", fr: "jours" })
              })`
              : ""
          } - ${currency(quote.priceDetails.due)}`,
        )
        .render();

      const label = new ZircusElement("label", "row", {
        for: `shipping-${quote.serviceCode}`,
      }).render();

      const input = new ZircusElement("input", null, {
        type: "radio",
        name: "shipping",
        value: quote.serviceCode,
        "data-price": quote.priceDetails.due,
        id: `shipping-${quote.serviceCode}`,
      })
        .event("input", (event) => this.inputHandler(event, quote.serviceCode))
        .render();

      if (i === 0) {
        input.setAttribute("checked", true);
        this.setAttribute("shipping-type", quote.serviceCode);
        this.setAttribute("shipping-price", quote.priceDetails.due);
      }
      label.appendChild(input);
      label.appendChild(labelText);
      this.#container.appendChild(label);
    });
    this.#fieldset.appendChild(this.#container);
    this.#fieldset.classList.remove("hidden");
    this.#isMounted = true;
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

const Template = {
  spinner: `<zircus-spinner></zircus-spinner>`,
  placeholder: () =>
    `<span class="shipping__placeholder">(${
      withLang({
        en: "shipping options will load once form is filled",
        fr:
          "les options d'expédition se chargeront une fois le formulaire rempli",
      })
    })</span>`,
};

customElements.get("zircus-shipping-inputs") ||
  customElements.define("zircus-shipping-inputs", ShippingInputs);
