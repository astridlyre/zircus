import { currency, eventBus, withLang, ZircusElement } from "../utils.js";
import cart from "../cart.js";
import ZircusRouter from "../router/router.js";
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
    this.#checkoutButton.addEventListener(
      "click",
      () => ZircusRouter.navigate(this.getAttribute("checkoutpath")),
    );
    eventBus.dispatchEvent(
      new CustomEvent("preload-mounted", {
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
      () => ZircusRouter.navigate(this.getAttribute("checkoutpath")),
    );
  }

  updateStatus() {
    this.#subtotalText.textContent = currency(cart.total);
    this.#checkoutButton.disabled = cart.length <= 0;
  }

  renderCartProducts() {
    !cart.length
      ? requestAnimationFrame(() => {
        this.#emptyCartPlaceholder.classList.remove("hidden");
        this.updateStatus();
      })
      : requestAnimationFrame(() => {
        const fragment = new DocumentFragment();
        this.#emptyCartPlaceholder.classList.add("hidden");
        cart.items.forEach((item) => {
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
            () => this.updateStatus(),
          );
          aCartProduct.addEventListener(
            "render",
            () => this.renderCartProducts(),
          );
          fragment.appendChild(aCartProduct);
        });
        this.#cartProductsList.appendChild(fragment);
        this.updateStatus();
      });
  }
}

customElements.get("zircus-cart") ||
  customElements.define("zircus-cart", ZircusCart);
