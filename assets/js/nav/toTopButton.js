export default class ZircusToTopButton extends HTMLElement {
  #MIN_SCROLL = 400;
  #button;
  #isHidden = true;
  #isUpdating = false;

  connectedCallback() {
    this.#button = this.querySelector("#to-top-button");
    this.#button.addEventListener("click", () => {
      window.scroll({ top: 0 });
      this.#button.blur();
    });
    document.addEventListener(
      "scroll",
      () => this.scrollHandler(window.scrollY > this.#MIN_SCROLL),
    );

    document.addEventListener(
      "menu-open",
      () => !this.isHidden && this.hide(),
    );

    document.addEventListener(
      "menu-closed",
      () => !this.isHidden && this.show(),
    );
  }

  get isHidden() {
    return this.#isHidden;
  }

  set isHidden(value) {
    this.#isHidden = value;
    requestAnimationFrame(() => this.#isHidden ? this.hide() : this.show());
  }

  show() {
    this.#button.classList.add("show");
    this.#isUpdating = false;
  }

  hide() {
    this.#button.classList.remove("show");
    this.#isUpdating = false;
  }

  scrollHandler(shouldShow) {
    if (this.#isUpdating) return;
    this.#isUpdating = true;
    return shouldShow && this.isHidden
      ? (this.isHidden = false)
      : !shouldShow && !this.isHidden
      ? (this.isHidden = true)
      : (this.#isUpdating = false);
  }
}

customElements.get("zircus-to-top-button") ||
  customElements.define("zircus-to-top-button", ZircusToTopButton);
