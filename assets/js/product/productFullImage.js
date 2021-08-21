import { ZircusElement } from "../utils.js";

export default class FullImage extends HTMLElement {
  #image;
  #isHidden;

  connectedCallback() {
    this.#image = new ZircusElement(
      "img",
      "product__full__img",
    ).render();
    this.appendChild(this.#image);
    this.#image.src = this.getAttribute("src");
    this.#image.alt = this.getAttribute("alt");
    this.#image.title = this.getAttribute("title");
    this.classList.add("full");
  }

  set hidden(value) {
    this.#isHidden = value;
    this.#isHidden ? this.hide() : this.show();
  }

  set src(value) {
    this.#image.src = value;
  }

  show() {
    this.style.display = "flex";
    document.getElementById("nav").classList.add("hidden");
    document.getElementById("menu-mobile-btn").classList.add("hidden");
    document.body.classList.add("hide-y");
  }

  hide() {
    this.style.display = "none";
    document.getElementById("nav").classList.remove("hidden");
    document
      .getElementById("menu-mobile-btn")
      .classList.remove("hidden");
    document.body.classList.remove("hide-y");
  }
}

customElements.get("zircus-full-image") ||
  customElements.define("zircus-full-image", FullImage);
