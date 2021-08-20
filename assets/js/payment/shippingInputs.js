import { currency, withLang, ZircusElement } from "../utils.js";
import shippingTypes from "./shippingTypes.js";

export default class ShippingInputs extends HTMLElement {
  #fieldset;
  #container;

  connectedCallback() {
    this.#fieldset = this.querySelector(
      "#checkout-shipping-inputs",
    );
    this.#container = new ZircusElement("div", "flex-inputs").render();
    Object.entries(shippingTypes).forEach(([key, type]) => {
      const labelText = new ZircusElement("span", null)
        .addChild(
          `${withLang(type.name)} - ${currency(type.price)}`,
        )
        .render();

      const label = new ZircusElement("label", "row", {
        for: `shipping-${key}`,
      }).render();

      const input = new ZircusElement("input", null, {
        type: "radio",
        name: "shipping",
        value: type.name.en.toLowerCase(),
        "data-price": type.price,
        id: `shipping-${key}`,
      })
        .event("input", (event) => this.inputHandler(event, key))
        .render();

      if (type.default) {
        this.setAttribute("shipping-type", key);
        this.setAttribute("shipping-price", type.price);
        input.checked = true;
      }

      label.appendChild(input);
      label.appendChild(labelText);
      this.#container.appendChild(label);
    });
    this.#fieldset.appendChild(this.#container);
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
