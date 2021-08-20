import { state, withLang, ZircusElement } from "../utils.js";
import intText from "../int/intText.js";
import withPhoneValidation from "./withPhoneValidation.js";
import withPostalCodeValidation from "./withPostalCodeValidation.js";
import OrderData from "../orderData.js";

const CANADA_POSTAL_CODE = /^[A-Za-z][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]$/;
const US_ZIP_CODE = /^[0-9]{5}(-[0-9]{4})?$/;
const { formText } = intText.checkout;

export default class ZircusCheckoutForm extends HTMLElement {
  #form;
  #phoneInput;
  #postalCodeInput;
  #postalCodeLabel;
  #countryInput;
  #stateInput;
  #stateLabel;
  #shippingInputs;

  connectedCallback() {
    this.#form = this.querySelector("form");
    this.#phoneInput = this.querySelector("#checkout-phone");
    this.#postalCodeInput = this.querySelector("#checkout-postal-code");
    this.#postalCodeLabel = this.querySelector("#checkout-postal-code-text");
    this.#countryInput = this.querySelector("#checkout-country");
    this.#stateInput = this.querySelector("#checkout-state");
    this.#stateLabel = this.querySelector("#checkout-state-text");
    this.#shippingInputs = this.querySelector("zircus-shipping-inputs");

    this.handleCountryChange();

    this.#phoneInput.addEventListener(
      "input",
      (event) => this.validatePhone(event),
    );

    this.#phoneInput.addEventListener(
      "blur",
      (event) => this.validatePhone(event),
    );

    this.#postalCodeInput.addEventListener(
      "input",
      (event) => this.validatePostalCode(event, this.#countryInput.value),
    );

    this.#postalCodeInput.addEventListener(
      "blur",
      (event) => this.validatePostalCode(event, this.#countryInput.value),
    );

    this.#countryInput.addEventListener(
      "input",
      () => this.handleCountryChange(),
    );

    this.#stateInput.addEventListener(
      "input",
      () => this.dispatchEvent(new CustomEvent("state-changed")),
    );

    this.#form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.dispatchEvent(
        new CustomEvent("form-submit", {
          detail: new OrderData({
            ...this.processFormData(),
            paymentMethod: event.submitter.value,
          }),
        }),
      );
    });
  }

  processFormData() {
    return [...new FormData(this.#form).entries()].reduce(
      (obj, [key, val]) =>
        key.startsWith("address-")
          ? {
            ...obj,
            address: {
              ...obj.address,
              [key.replace("address-", "")]: val.trim(),
            },
          }
          : key.startsWith("shipping")
          ? {
            ...obj,
            shipping: this.#shippingInputs.value,
          }
          : {
            ...obj,
            [key]: val.trim(),
          },
      { address: {} },
    );
  }

  populateSelects(select, data = [], fn) {
    select.textContent = ""; // clear children
    data.forEach((item, i) => {
      select.appendChild(
        new ZircusElement("option", null, {
          value: fn(item),
          selected: i === 0,
        })
          .addChild(fn(item))
          .render(),
      );
    });
  }

  handleCountryChange(country = this.#countryInput.value) {
    return requestAnimationFrame(() => {
      this.#stateInput.textContent = "";
      this.#postalCodeInput.value = "";
      this.populateSelects(
        this.#stateInput,
        state.countries[country].states,
        (item) => item.name,
      );
      this.#stateLabel.textContent = withLang(
        formText[country],
      )[0];
      this.#postalCodeLabel.textContent = withLang(
        formText[country],
      )[1];
      this.#postalCodeInput.setAttribute(
        "pattern",
        country === "Canada" ? CANADA_POSTAL_CODE.source : US_ZIP_CODE.source,
      );
      this.#postalCodeInput.setAttribute(
        "maxlength",
        country === "Canada" ? "7" : "10",
      );
      this.#postalCodeInput.setAttribute(
        "size",
        country === "Canada" ? "7" : "10",
      );
      this.dispatchEvent(new CustomEvent("country-changed"));
    });
  }
}

Object.assign(
  ZircusCheckoutForm.prototype,
  withPhoneValidation(),
  withPostalCodeValidation(),
);

customElements.get("zircus-checkout-form") ||
  customElements.define("zircus-checkout-form", ZircusCheckoutForm);
