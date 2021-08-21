import { currency, ZircusElement } from "../utils.js";

export default class ZircusProductPriceText extends HTMLElement {
  #parent;
  #price;
  #status;

  connectedCallback() {
    this.#parent = document.querySelector("zircus-product");
    this.#price = document.createElement("span");
    this.#status = new ZircusElement("p", "product__inputs_stock").render();
    this.appendChild(this.#price);
    this.appendChild(this.#status);
    this.classList.add("product__price");

    this.#parent.addEventListener(
      "wants-update",
      ({ detail }) => {
        detail.price && this.setPrice();
        detail.status && this.setStatus();
      },
    );
  }

  get price() {
    return this.#parent.currentItem.price;
  }

  get productQuantity() {
    return this.#parent.currentItem.quantity;
  }

  get quantity() {
    return this.#parent.quantity;
  }

  setPrice() {
    requestAnimationFrame(() => {
      this.#price.textContent = currency(this.price * this.quantity);
    });
  }

  setStatus() {
    requestAnimationFrame(() => {
      this.#status.textContent = this.productQuantity <= 0
        ? this.getAttribute("outstock")
        : this.productQuantity < 5
        ? this.getAttribute("fewleft").replace(
          "|",
          this.productQuantity,
        )
        : this.getAttribute("instock");
    });
  }
}

customElements.get("zircus-product-price-text") ||
  customElements.define("zircus-product-price-text", ZircusProductPriceText);
