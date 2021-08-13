import withCartQty from "./withCartQty.js";

const withScrollState = (prevPos, currentPos) => {
  function* scrollState() {
    while (true) {
      [prevPos, currentPos] = [currentPos, window.scrollY];
      yield currentPos - prevPos;
    }
  }
  return { scrollState: scrollState() };
};

/*
 *   Menu for Zircus
 *
 *   createMenuFunc() creates the mobile menu functionality,
 *   toggling state from hidden to not hidden.
 *
 *   updateNavLink() sets the textContent of the Desktop and
 *   Mobile 'cart' nav link to the number of cart items.
 */
export default function menu() {
  class NavMenu extends HTMLElement {
    #MIN_SCROLL = 100;
    #isHidden = false;
    #isFocused = false;
    #updating = false;
    #nav;
    cartLink;

    connectedCallback() {
      this.#nav = this.querySelector("#nav");
      this.cartLink = this.querySelector("#cart-link");
      this.updateCartLink(); // set cart text
      this.#nav.addEventListener("focusin", () => (this.isFocused = true));
      this.#nav.addEventListener(
        "focusout",
        () => (this.isFocused = false),
      );
      document.addEventListener("scroll", () => {
        this.scrollHandler(
          window.scrollY < this.#MIN_SCROLL ||
            this.scrollState.next().value <= 0,
        );
      });
      document.addEventListener("cart-updated", () => this.updateCartLink());
      document.addEventListener("navigated", () => {
        this.isHidden = false;
      });
    }

    get isFocused() {
      return this.#isFocused;
    }

    set isFocused(value) {
      this.#isFocused = value;
      requestAnimationFrame(() =>
        this.#isFocused || window.scrollY < this.#MIN_SCROLL
          ? this.show()
          : this.hide()
      );
    }

    get isHidden() {
      return this.#isHidden;
    }

    set isHidden(value) {
      this.#updating = true;
      this.#isHidden = value;
      requestAnimationFrame(() => this.#isHidden ? this.hide() : this.show());
    }

    show() {
      document.querySelector("#nav").classList.remove("slide-up");
      this.#updating = false;
    }

    hide() {
      document.querySelector("#nav").classList.add("slide-up");
      this.#updating = false;
    }

    scrollHandler(isScrollingUp) {
      if (this.#updating) return;
      if (isScrollingUp && this.isHidden) return (this.isHidden = false);
      if (!isScrollingUp && !this.isHidden) return (this.isHidden = true);
    }
  }

  Object.assign(NavMenu.prototype, withCartQty(), withScrollState(0, 0));

  customElements.get("zircus-nav-desktop") ||
    customElements.define("zircus-nav-desktop", NavMenu);
}
