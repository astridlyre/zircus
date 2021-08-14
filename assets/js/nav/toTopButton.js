export default class ToTopButton extends HTMLElement {
  #MIN_SCROLL = 400;
  #button;
  #isHidden = true;
  #updating = false;

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
    this.#updating = false;
  }

  hide() {
    this.#button.classList.remove("show");
    this.#updating = false;
  }

  scrollHandler(shouldShow) {
    if (this.#updating) return;
    this.#updating = true;
    return shouldShow && this.isHidden
      ? (this.isHidden = false)
      : !shouldShow && !this.isHidden
      ? (this.isHidden = true)
      : (this.#updating = false);
  }
}

customElements.get("zircus-to-top-button") ||
  customElements.define("zircus-to-top-button", ToTopButton);
