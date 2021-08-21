import { appendPreloadLinks, eventBus, Range, state } from "../utils.js";
import cart from "../cart.js";
import inventory from "../inventory.js";
import withCartQuantity from "../nav/withCartQuantity.js";

const IMAGE_BASE_PATH = "/assets/img/products/masked/";
// Preload images
function makeLinks(prefix, color) {
  return ["a-400.png", "b-400.png", "a-1920.jpg"].map(
    (image) => `${IMAGE_BASE_PATH}${prefix}-${color}-${image}`,
  );
}

/* Path for masked product images. Images follow the convention:

  [prefix]-[color]-[view]-[size].png

  Where prefix is either 'ff', 'pf', or 'cf'
  color is 'yellow', 'teal', 'purple', 'black' or 'stripe'
  view is 'a' (front) or 'b' (folded)
  and size is the image size 400, 600 or 1000
*/
export default class ZircusProduct extends HTMLElement {
  #needsUpdate = true;
  #currentItem;
  #sizeInput;
  #quantityInput;
  #colorInput;
  #defaultColor;
  #currentColor;
  #productAccent;

  connectedCallback() {
    this.#sizeInput = this.querySelector("#product-size");
    this.#quantityInput = this.querySelector("#product-quantity");
    this.#colorInput = this.querySelector("#product-color");
    this.cartLink = this.querySelector("#go-to-cart");
    this.#productAccent = this.querySelector("#product-accent");
    this.#defaultColor = this.getAttribute("defaultcolor");
    this.#currentColor = this.color;

    // Initial updates
    this.preloadImages()
      .updateStatus({ price: true, status: true })
      .updateColorOptionText()
      .updateSizeOptionText()
      .updateCartLink();

    // Add event listeners
    this.#colorInput.addEventListener(
      "change",
      () =>
        this.updateStatus({ images: true, status: true })
          .updateSizeOptionText(),
    );

    this.#quantityInput.addEventListener("change", () => {
      this.#quantityInput.value = Math.min(
        this.quantity,
        this.currentItem.quantity,
      );
      this.wantsUpdate({ price: true });
    });

    this.#quantityInput.addEventListener("blur", () => {
      this.#quantityInput.value = new Range(1, this.currentItem.quantity)
        .normalize(this.quantity);
      this.wantsUpdate({ price: true });
    });

    this.#sizeInput.addEventListener(
      "change",
      () => this.updateStatus({ status: true }).updateColorOptionText(),
    );

    eventBus.addEventListener(
      inventory.INV_UPDATED_EVENT,
      () => this.updateStatus({ status: true }),
    );
    eventBus.addEventListener(
      cart.CART_UPDATED_EVENT,
      () => this.updateCartLink(),
    );
  }

  wantsUpdate(
    { images = false, status = false, price = false },
  ) {
    this.dispatchEvent(
      new CustomEvent("wants-update", {
        detail: {
          images,
          status,
          price,
        },
      }),
    );
  }

  get color() {
    return this.#colorInput.value;
  }

  get quantity() {
    return Number(this.#quantityInput.value);
  }

  get prefix() {
    return this.getAttribute("prefix");
  }

  get currentItem() {
    if (this.#needsUpdate) {
      this.#needsUpdate = false;
      return (this.#currentItem = inventory.find(
        `${this.prefix}-${this.color}-${this.#sizeInput.value}`,
      ));
    }
    return this.#currentItem;
  }

  preloadImages(
    colors = [...this.#colorInput.children],
    defaultColor = colors.find(
      (child) => child.value === this.#defaultColor,
    ),
  ) {
    appendPreloadLinks(
      colors.flatMap((color) => makeLinks(this.prefix, color.value)),
    );
    defaultColor.setAttribute("selected", true);
    this.querySelector("#product-accent").classList.add(
      `${defaultColor.value}-before`,
    );
    this.#currentColor = defaultColor.value; // set currentColor
    return this;
  }

  updateOptionText({ input, test, alt }) {
    requestAnimationFrame(() =>
      [...input.children].forEach((child) => {
        child.textContent = `${child.textContent.split(" - ")[0]} - (${alt} ${
          inventory.find(test(child))?.quantity > 0
            ? this.getAttribute("instock").toLowerCase()
            : this.getAttribute("outstock").toLowerCase()
        })`;
      })
    );
    return this;
  }

  updateSizeOptionText() {
    return this.updateOptionText({
      input: this.#sizeInput,
      alt: this.color,
      test: (child) => `${this.prefix}-${this.color}-${child.value}`,
    });
  }

  updateColorOptionText() {
    return this.updateOptionText({
      input: this.#colorInput,
      alt: this.#sizeInput.value,
      test: (child) => `${this.prefix}-${child.value}-${this.#sizeInput.value}`,
    });
  }

  updateStatus({ images, status, price }) {
    if (!inventory.length) return this;
    const { currentItem } = state;
    requestAnimationFrame(() => {
      if (currentItem) {
        this.#sizeInput.value = currentItem.size;
        this.#colorInput.value = currentItem.color;
        state.currentItem = null;
      }
      this.#needsUpdate = true;
      this.#productAccent.classList.replace(
        `${this.#currentColor}-before`,
        `${this.color}-before`,
      );
      this.#currentColor = this.color;
      this.#quantityInput.disabled = !this.currentItem ||
        this.currentItem.quantity <= 0;
      this.#quantityInput.value = new Range(1, this.currentItem.quantity)
        .normalize(this.quantity);
      this.wantsUpdate({ images, status, price });
    });
    return this;
  }
}

Object.assign(ZircusProduct.prototype, withCartQuantity());

customElements.get("zircus-product") ||
  customElements.define("zircus-product", ZircusProduct);
