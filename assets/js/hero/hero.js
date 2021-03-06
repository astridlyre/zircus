import { appendPreloadLinks, ZircusElement } from "../utils.js";

const preloadImages = (() => {
  let preloaded = false;
  return (images) => {
    if (preloaded) return;
    preloaded = true;
    appendPreloadLinks(images);
  };
})();

export default class Hero extends HTMLElement {
  #images;
  #imageElement;
  #container;
  #currentImage = 1;
  #interval;

  connectedCallback() {
    this.#images = new Array(Number(this.getAttribute("num-images")))
      .fill("")
      .map((_, i) => `${this.getAttribute("image-path")}${i + 1}.jpg`);
    preloadImages(this.#images);
    this.#imageElement = new ZircusElement(
      "img",
      "hero__image",
      { src: this.src },
    ).render();
    this.#container = new ZircusElement("div", "hero__container").addChild(
      new ZircusElement("div", [
        "bg-light",
        "hero__rounded",
      ]),
    ).render();
    this.#container.appendChild(this.#imageElement);
    this.appendChild(this.#container);
    this.classList.add("hero");
    this.#interval = setInterval(() => {
      this.#imageElement.src = this.src;
    }, 4500);
  }

  disconnectedCallback() {
    clearInterval(this.#interval);
  }

  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case "alt":
        return this.#imageElement && (this.#imageElement.alt = alt);
      case "title":
        return (
          this.#imageElement &&
          this.#imageElement.setAttribute("title", newValue)
        );
    }
  }

  get currentImage() {
    return this.#currentImage === this.#images.length
      ? (this.#currentImage = 1)
      : this.#currentImage++;
  }

  get src() {
    return `${this.getAttribute("image-path")}${this.currentImage}.jpg`;
  }
}

customElements.get("zircus-hero-image") ||
  customElements.define("zircus-hero-image", Hero);
