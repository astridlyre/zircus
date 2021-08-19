import { eventBus, state } from "../utils.js";
import withCartQuantity from "./withCartQuantity.js";

export default class ZircusMobileMenu extends HTMLElement {
  cartLink;

  connectedCallback() {
    this.classList.add("nav_mobile");
    this.cartLink = this.querySelector("#cart-link-mobile");
    this.updateCartLink();
    eventBus.addEventListener(
      state.CART_UPDATED_EVENT,
      () => this.updateCartLink(),
    );
  }
}

Object.assign(ZircusMobileMenu.prototype, withCartQuantity());

customElements.get("zircus-mobile-menu") ||
  customElements.define("zircus-mobile-menu", ZircusMobileMenu);
