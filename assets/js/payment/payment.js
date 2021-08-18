import { calculateTax, currency, state, withLang } from "../utils.js";
import intText from "../int/intText.js";
import shippingTypes from "./shippingTypes.js";

export default class Payment extends HTMLElement {
  #form;
  #formState;
  #formCountry;
  #checkoutSubtotal;
  #checkoutTotal;
  #checkoutTax;
  #checkoutShipping;
  #shippingInputs;
  #productList;

  connectedCallback() {
    if (!state.cart.length) {
      this.showEmptyCartModal();
    }

    this.#form = this.querySelector("zircus-checkout-form");
    this.#formState = this.querySelector("#checkout-state");
    this.#formCountry = this.querySelector("#checkout-country");
    this.#checkoutSubtotal = this.querySelector("#checkout-subtotal");
    this.#checkoutTax = this.querySelector("#checkout-tax");
    this.#checkoutTotal = this.querySelector("#checkout-total");
    this.#checkoutShipping = this.querySelector("#checkout-shipping");
    this.#shippingInputs = this.querySelector("zircus-shipping-inputs");
    this.#productList = this.querySelector("#checkout-products");

    // Render Items
    this.renderCartItems();

    // Add event listeners
    this.#form.addEventListener("country-changed", () => this.setTotals());
    this.#form.addEventListener("state-changed", () => this.setTotals());
    this.#shippingInputs.addEventListener(
      "method-changed",
      () => this.setTotals(),
    );
    this.#shippingInputs.addEventListener("mounted", () => this.setTotals());
  }

  showEmptyCartModal() { // redirects user to shop page if no items in cart
    return state.showModal({
      content: withLang(intText.checkout.modalText).content,
      heading: withLang(intText.checkout.modalText).heading,
      ok: {
        text: withLang(intText.checkout.modalText).okText,
        title: withLang(intText.checkout.modalText).okTitle,
        action: ({ closeModal }) => {
          closeModal();
          document.querySelector("zircus-router").page = withLang({
            en: "/shop",
            fr: "/fr/boutique",
          });
        },
      },
    });
  }

  setTotals() {
    requestAnimationFrame(() => {
      const shipping = Number(
        shippingTypes[this.#shippingInputs.value]?.price,
      );
      const subtotal = state.cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
      const tax = (subtotal + shipping) *
        calculateTax(this.#formCountry.value, this.#formState.value);
      const total = subtotal + shipping + tax;

      // Set text
      this.#checkoutSubtotal.textContent = currency(subtotal);
      this.#checkoutShipping.textContent = currency(shipping);
      this.#checkoutTax.textContent = currency(tax);
      this.#checkoutTotal.textContent = currency(total);
    });
  }

  renderCartItems(fragment = new DocumentFragment()) {
    return requestAnimationFrame(() => {
      state.cart.forEach((item) => {
        const el = document.createElement("zircus-cart-product");
        el.item = item;
        fragment.appendChild(el);
      });
      this.#productList.appendChild(fragment);
    });
  }
}

customElements.get("zircus-payment") ||
  customElements.define("zircus-payment", Payment);
