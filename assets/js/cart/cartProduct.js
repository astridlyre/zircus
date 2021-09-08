import {
  currency,
  lang,
  notifySuccess,
  Range,
  setAttributes,
  withLang,
  ZircusElement,
} from "../utils.js";
import intText from "../int/intText.js";
import inventory from "../inventory.js";
import cart from "../cart.js";

const { removeButtonText, removeNotificationText } = intText.cart;

export default class ZircusCartProduct extends HTMLElement {
  #item;
  #template;
  #link;
  #image;
  #description;
  #price;
  #quantity;
  #label;
  #removeButton;

  connectedCallback() {
    this.#template = document
      .getElementById("zircus-product-template")
      .content.cloneNode(true);
    this.#link = this.#template.querySelector("a");
    this.#image = this.#template.querySelector("img");
    this.#description = this.#template.querySelector("p");
    this.#price = this.#template.querySelector("span");
    this.#quantity = this.#template.querySelector(".input");
    this.#label = this.#template.querySelector("label");
    this.#removeButton = this.#template.querySelector("button");
    this.classList.add("cart__product");

    // Set atttributes
    setAttributes(this.#link, {
      href: this.createLinkHref(this.item),
      title: this.name,
    });
    setAttributes(this.#image, {
      src: this.item.images.sm_a,
      alt: `${this.name} ${this.item.size} ${this.item.color} underwear`,
    });

    if (!this.getAttribute("withactions")) {
      this.#description.textContent = `${this.name} (${this.item.size}) x${this.item.quantity}`;
    } else {
      this.addCartProductActions();
    }
    this.appendChild(this.#template);
  }

  get name() {
    return withLang(this.item.name);
  }

  get quantity() {
    return Number(this.#quantity.value);
  }

  set item(item) {
    this.#item = item;
  }

  get item() {
    return this.#item;
  }

  addCartProductActions() {
    this.#description.textContent = `${this.name} (${this.item.size})`;
    this.#price.textContent = currency(this.item.price * this.item.quantity);

    // quantity input
    this.#label.setAttribute("for", this.item.type);
    setAttributes(this.#quantity, {
      value: this.item.quantity,
      id: this.item.type,
      name: `${this.name} ${this.item.size} ${this.item.color}`,
    });
    this.#quantity.addEventListener("input", event =>
      this.handleUpdateItemQuantity(event)
    );

    // Add remove button functionality
    setAttributes(this.#removeButton, {
      title: withLang(removeButtonText(this.item)),
      "aria-label": withLang(removeButtonText(this.item)),
    });
    this.#removeButton.addEventListener("click", () => this.handleRemoveItem());
  }

  handleUpdateItemQuantity(event) {
    event.target.value = new Range(
      1,
      inventory.find(this.item.type).quantity
    ).normalize(this.quantity);
    cart.update(this.item.type, item => item.setQuantity(this.quantity));
    this.#price.textContent = currency(this.item.price * this.quantity);
    this.#removeButton.setAttribute(
      "title",
      withLang(removeButtonText(this.item.setQuantity(this.quantity)))
    );
    this.dispatchEvent(new CustomEvent("update-totals"));
  }

  handleRemoveItem() {
    cart.remove(this.item.type);
    notifySuccess(this.createNotificationElements(this.#link.href));
    this.dispatchEvent(new CustomEvent("update-totals"));
    !cart.length && this.dispatchEvent(new CustomEvent("render"));
    this.remove();
  }

  createLinkHref(item) {
    return `/products/${item.name.en.toLowerCase().split(" ").join("-")}${
      lang() !== "en" ? `-${lang()}` : ""
    }.html?color=${this.item.color}&size=${this.item.size}`;
  }

  createNotificationElements(href) {
    return [
      new ZircusElement("img", "notification__image", {
        src: this.item.images.sm_a,
        alt: this.name,
      }).render(),
      new ZircusElement("zircus-router-link")
        .addChild(
          new ZircusElement("a", "notification__text", {
            href,
            title: withLang({
              en: "Go to product page",
              fr: "Aller au page du produit",
            }),
          }).addChild(withLang(removeNotificationText(this.item)))
        )
        .render(),
    ];
  }
}

customElements.get("zircus-cart-product") ||
  customElements.define("zircus-cart-product", ZircusCartProduct);
