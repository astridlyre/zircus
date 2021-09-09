import { setAttributes, ZircusElement } from "../utils.js";

export default class ProductImage extends HTMLElement {
  #image = null;
  #isHovered = false;
  #updating = false;
  #fullImage;
  #parent;

  connectedCallback() {
    this.#parent = document.querySelector("zircus-product");
    this.#parent.addEventListener("wants-update", ({ detail }) => {
      if (detail.images) {
        if (!this.#image) this.init();
        else this.handleUpdate();
      }
    });
  }

  init() {
    this.#image = new ZircusElement("img", "product__img").render();
    this.#fullImage = document.createElement("zircus-full-image");
    setAttributes(this.#fullImage, {
      alt: this.getAttribute("alt"),
      title: this.getAttribute("fulltitle"),
      src: this.images.lg_a,
      hidden: true,
    });
    setAttributes(this.#image, {
      alt: this.getAttribute("alt"),
      src: this.images.sm_a,
      title: `${this.getAttribute("title")} (${this.getAttribute("viewfull")})`,
    });
    this.appendChild(this.#image);
    this.appendChild(this.#fullImage);
    this.#fullImage.addEventListener(
      "click",
      () => (this.#fullImage.hidden = true)
    );
    this.#image.addEventListener(
      "pointerenter",
      () => !this.#updating && (this.isHovered = true)
    );
    this.#image.addEventListener(
      "pointerleave",
      () => !this.#updating && (this.isHovered = false)
    );
    this.#image.addEventListener(
      "click",
      () => (this.#fullImage.hidden = false)
    );
  }

  handleUpdate() {
    this.#fullImage.src = this.images.lg_a;
    this.#image.src = this.images.sm_a;
  }

  get images() {
    return this.#parent.currentItem.images;
  }

  set isHovered(value) {
    this.#isHovered = value;
    requestAnimationFrame(() => {
      this.#isHovered
        ? (this.#image.src = this.images.sm_b)
        : (this.#image.src = this.images.sm_a);
      this.#updating = false;
    });
  }

  get isHovered() {
    return this.#isHovered;
  }
}

customElements.get("zircus-product-image") ||
  customElements.define("zircus-product-image", ProductImage);
