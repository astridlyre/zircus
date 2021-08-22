import { calculateTax, withLang } from "../utils.js";
import ZircusModal from "../modal/modal.js";
import ZircusRouter from "../router/router.js";
import intText from "../int/intText.js";
import cart from "../cart.js";

export default class Payment extends HTMLElement {
  #form;
  #formState;
  #formCountry;
  #totals;
  #shippingInputs;
  #productList;

  connectedCallback() {
    !cart.length && this.showEmptyCartModal();
    this.#form = this.querySelector("zircus-checkout-form");
    this.#formState = this.querySelector("#checkout-state");
    this.#formCountry = this.querySelector("#checkout-country");
    this.#totals = this.querySelector("zircus-cart-totals");
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

  get taxTotal() {
    return (cart.total + this.#shippingInputs.value.total) *
      calculateTax(this.#formCountry.value, this.#formState.value);
  }

  get total() {
    return cart.total + this.#shippingInputs.value.total + this.taxTotal;
  }

  setTotals() {
    requestAnimationFrame(() => {
      this.#totals.setAttribute("subtotal", cart.total);
      this.#totals.setAttribute("shipping", this.#shippingInputs.value.total);
      this.#totals.setAttribute("tax", this.taxTotal);
      this.#totals.setAttribute("total", this.total);
    });
  }

  showEmptyCartModal() { // redirects user to shop page if no items in cart
    return ZircusModal.show({
      content: withLang(intText.checkout.modalText).content,
      heading: withLang(intText.checkout.modalText).heading,
      ok: {
        text: withLang(intText.checkout.modalText).okText,
        title: withLang(intText.checkout.modalText).okTitle,
        action: () => {
          ZircusModal.close();
          ZircusRouter.navigate(withLang({
            en: "/shop",
            fr: "/fr/boutique",
          }));
        },
      },
    });
  }

  renderCartItems(fragment = new DocumentFragment()) {
    return requestAnimationFrame(() => {
      cart.items.forEach((item) => {
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
