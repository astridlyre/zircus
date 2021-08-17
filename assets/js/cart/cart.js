import { eventBus, state, withLang, ZircusElement } from "../utils.js";

/*
    Cart performs the functions manage the shopping cart.
    Uses the 'state' object to store state in localStorage
    and updates the 'cart' nav-link upon changes.
*/
export default class ZircusCart extends HTMLElement {
  #checkoutButton;
  #subtotalText;
  #cartProductsList;
  #emptyCartPlaceholder;

  connectedCallback() {
    this.#checkoutButton = this.querySelector("#cart-checkout");
    this.#subtotalText = this.querySelector("#cart-subtotal");
    this.#cartProductsList = this.querySelector("#cart-products");
    this.#emptyCartPlaceholder = this.querySelector(
      "#cart-products-none",
    );

    this.renderCartProducts();
    this.#checkoutButton.addEventListener("click", () => this.goToCheckout());
    eventBus.dispatchEvent(
      new CustomEvent("preload", {
        detail: withLang({
          en: `/checkout`,
          fr: `/fr/la-caisse`,
        }),
      }),
    );
  }

  disconnectedCallback() {
    this.#checkoutButton.removeEventListener(
      "click",
      () => this.goToCheckout(),
    );
  }

  goToCheckout() {
    document.querySelector("zircus-router").page = this.getAttribute(
      "checkoutpath",
    );
  }

  setCheckoutButtonStatus() {
    return state.cart.length > 0
      ? (this.#checkoutButton.disabled = false)
      : (this.#checkoutButton.disabled = true);
  }

  updateSubtotalText() {
    this.#subtotalText.textContent = `$${
      state.cart
        .reduce((acc, item) => (acc += item.price * item.quantity), 0)
        .toFixed(2)
    }`;
    return this.setCheckoutButtonStatus();
  }

  renderCartProducts() {
    !state.cart.length
      ? requestAnimationFrame(() => {
        this.#emptyCartPlaceholder.classList.remove("hidden");
        this.updateSubtotalText();
      })
      : requestAnimationFrame(() => {
        const fragment = new DocumentFragment();
        this.#emptyCartPlaceholder.classList.add("hidden");
        state.cart.forEach((item) => {
          const aCartProduct = new ZircusElement(
            "zircus-cart-product",
            null,
            {
              withactions: true,
            },
          ).render();
          aCartProduct.item = item;
          aCartProduct.addEventListener(
            "update-totals",
            () => this.updateSubtotalText(),
          );
          aCartProduct.addEventListener(
            "render",
            () => this.renderCartProducts(),
          );
          fragment.appendChild(aCartProduct);
        });
        this.#cartProductsList.appendChild(fragment);
        this.updateSubtotalText();
      });
  }
}

customElements.get("zircus-cart") ||
  customElements.define("zircus-cart", ZircusCart);
