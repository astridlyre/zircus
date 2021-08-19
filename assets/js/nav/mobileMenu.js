import { eventBus, state } from "../utils.js";
import ZircusRouter from "../router/router.js";
import withCartQuantity from "./withCartQuantity.js";

export default class ZircusMobileMenu extends HTMLElement {
  cartLink;
  #list;
  #button;
  #isHidden = true;

  connectedCallback() {
    this.classList.add("nav_mobile");
    this.cartLink = this.querySelector("#cart-link-mobile");
    this.#list = this.querySelector("#menu-mobile-list");
    this.#button = this.querySelector("#menu-mobile-btn");
    this.updateCartLink();
    this.#list.addEventListener("click", (event) => {
      if (event.target === this.#list) this.isHidden = true;
    });
    this.#button.addEventListener(
      "click",
      () => (this.isHidden = !this.isHidden),
    );
    eventBus.addEventListener(
      state.CART_UPDATED_EVENT,
      () => this.updateCartLink(),
    );
    eventBus.addEventListener(
      ZircusRouter.NAVIGATED_EVENT,
      () => (this.isHidden = true),
    );
  }

  set isHidden(value) {
    this.#isHidden = value;
    requestAnimationFrame(() => this.#isHidden ? this.hide() : this.show());
  }

  get isHidden() {
    return this.#isHidden;
  }

  hide() {
    this.#list.classList.remove("show");
    document.body.classList.remove("hide-y");
  }

  show() {
    this.#list.classList.add("show");
    document.body.classList.add("hide-y");
  }
}

Object.assign(ZircusMobileMenu.prototype, withCartQuantity());

customElements.get("zircus-mobile-menu") ||
  customElements.define("zircus-mobile-menu", ZircusMobileMenu);
