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
    document.addEventListener("cart-updated", () => this.updateCartLink());
    document.addEventListener("navigated", () => (this.isHidden = true));
  }

  set isHidden(value) {
    this.#isHidden = value;
    requestAnimationFrame(() => this.#isHidden ? this.hide() : this.show());
  }

  get isHidden() {
    return this.#isHidden;
  }

  hide() {
    this.#list.classList.add("hide");
  }

  show() {
    this.#list.classList.remove("hide");
  }
}

Object.assign(ZircusMobileMenu.prototype, withCartQuantity());

customElements.get("zircus-mobile-menu") ||
  customElements.define("zircus-mobile-menu", ZircusMobileMenu);
