import {
  notifyFailure,
  notifySuccess,
  withLang,
  ZircusElement,
} from "../utils.js";
import cart from "../cart.js";

export default class ZircusAddToCartButton extends HTMLElement {
  #button;
  #parent;

  connectedCallback() {
    this.#button = new ZircusElement("button", ["btn", "btn__primary"], {
      type: "button",
      title: this.getAttribute("title"),
      "aria-label": this.getAttribute("aria-label"),
    })
      .render();
    this.appendChild(this.#button);
    this.#parent = document.querySelector("zircus-product");
    this.#parent.addEventListener(
      "wants-update",
      ({ detail }) => detail.status && this.handleUpdate(),
    );
    this.#button.addEventListener("click", () => this.handleAddToCart());
  }

  get item() {
    return this.#parent.currentItem;
  }

  enoughStock(existingQuantity = 0) {
    return this.item.quantity &&
      this.item.quantity >= (this.#parent.quantity + existingQuantity);
  }

  handleAddToCart() {
    if (!this.enoughStock()) {
      return notifyFailure(this.getAttribute("erroradd"));
    }
    const itemToUpdate = cart.find(this.item.type);
    if (itemToUpdate) {
      return this.updateCartItem(itemToUpdate);
    }
    cart.add(this.item.type, this.#parent.quantity);
    return this.notifySuccess();
  }

  updateCartItem(itemToUpdate) {
    if (this.enoughStock(itemToUpdate.quantity)) {
      cart.update(
        this.item.type,
        (item) => item.setQuantity(item.quantity + this.#parent.quantity),
      );
      return this.notifySuccess();
    } else {
      return notifyFailure(this.getAttribute("erroradd"));
    }
  }

  notifySuccess() {
    return notifySuccess([
      new ZircusElement("img", "notification__image", {
        src: this.item.images.sm_a,
        alt: this.item.name,
      }).render(),
      new ZircusElement("zircus-router-link")
        .addChild(
          new ZircusElement("a", "notification__text", {
            href: this.getAttribute("carthref"),
            title: this.getAttribute("carttitle"),
          }).addChild(
            this.getAttribute("successadd").replace(
              "|",
              withLang(this.item.name),
            ),
          ),
        )
        .render(),
    ]);
  }

  handleUpdate() {
    this.#button.disabled = this.item.quantity <= 0;
    this.#button.textContent = this.item.quantity <= 0
      ? this.getAttribute("outstock").toLowerCase()
      : this.getAttribute("addcarttext").toLowerCase();
  }
}

customElements.get("zircus-add-to-cart-button") ||
  customElements.define("zircus-add-to-cart-button", ZircusAddToCartButton);
