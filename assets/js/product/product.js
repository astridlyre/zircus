import {
  appendPreloadLinks,
  currency,
  eventBus,
  notifyFailure,
  notifySuccess,
  setAttributes,
  state,
  withLang,
  ZircusElement,
} from "../utils.js";

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
export default class Product extends HTMLElement {
  #needsUpdate = true;
  #currentItem;
  #sizeInput;
  #quantityInput;
  #colorInput;
  #defaultColor;
  #currentColor;
  #addToCartButton;

  connectedCallback() {
    this.#sizeInput = this.querySelector("#product-size");
    this.#quantityInput = this.querySelector("#product-quantity");
    this.#colorInput = this.querySelector("#product-color");
    this.#addToCartButton = this.querySelector("#add-to-cart");
    this.#defaultColor = this.getAttribute("defaultcolor");
    this.#currentColor = this.color;

    // Initial updates
    this.preloadImages()
      .updateStatus()
      .updateCartBtnQty()
      .updateColorOptionText()
      .updateSizeOptionText();

    // Add event listeners
    this.#colorInput.addEventListener(
      "change",
      () => this.updateStatus().updateSizeOptionText(),
    );

    this.#quantityInput.addEventListener("change", () => {
      this.#quantityInput.value = Math.min(
        this.quantity,
        this.currentItem.quantity,
      );
      this.setProductPriceText();
    });

    this.#quantityInput.addEventListener("blur", () => {
      this.#quantityInput.value = Math.max(
        Math.min(this.quantity, this.currentItem.quantity),
        1,
      );
      this.setProductPriceText();
    });

    this.#sizeInput.addEventListener(
      "change",
      () => this.updateStatus().updateColorOptionText(),
    );

    this.#addToCartButton.addEventListener(
      "click",
      () => this.handleAddToCart(),
    );

    eventBus.addEventListener(
      state.INV_UPDATED_EVENT,
      () => this.updateStatus(),
    );
    eventBus.addEventListener(
      state.CART_UPDATED_EVENT,
      () => this.updateCartBtnQty(),
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
      return (this.#currentItem = state.inv.find(
        (item) =>
          item.type ===
            `${this.prefix}-${this.color}-${this.#sizeInput.value}`,
      ));
    }
    return this.#currentItem;
  }

  setProductPriceText() {
    requestAnimationFrame(
      () => (this.querySelector("#product-price-text").textContent = currency(
        Math.abs(this.quantity * this.currentItem.price),
      )),
    );
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

  setImage() {
    this.currentItem &&
      setAttributes(this.querySelector("zircus-product-image"), {
        src: this.currentItem.images["sm_a"],
        hovered: this.currentItem.images["sm_b"],
        fullsrc: this.currentItem.images["lg_a"],
      });
  }

  notifySuccess() {
    return notifySuccess([
      new ZircusElement("img", "notification__image", {
        src: this.currentItem.images.sm_a,
        alt: this.currentItem.name,
      }).render(),
      new ZircusElement("zircus-router-link")
        .addChild(
          new ZircusElement("a", "notification__text", {
            href: this.getAttribute("carthref"),
            title: this.getAttribute("carttitle"),
          }).addChild(
            this.getAttribute("successadd").replace(
              "|",
              withLang(this.currentItem.name),
            ),
          ),
        )
        .render(),
    ]);
  }

  handleAddToCart(
    { type, quantity } = this.currentItem,
    [cartItem, invItem] = [
      state.cart.find((i) => i.type === type),
      state.inv.find((i) => i.type === type),
    ],
  ) {
    quantity - this.quantity < 0 || !quantity
      ? notifyFailure(this.getAttribute("erroradd"))
      : cartItem
      ? cartItem.quantity + this.quantity <= invItem.quantity
        ? this.updateCartItem().notifySuccess()
        : notifyFailure(this.getAttribute("erroradd"))
      : this.addNewCartItem().notifySuccess();
  }

  updateCartItem() {
    state.cart = (cart) =>
      cart.map((i) =>
        i.type === this.currentItem.type
          ? {
            ...i,
            quantity: i.quantity + this.quantity,
          }
          : i
      );
    return this;
  }

  addNewCartItem() {
    state.cart = (cart) =>
      cart.concat({
        ...this.currentItem,
        quantity: this.quantity,
      });
    return this;
  }

  updateCartBtnQty(
    newQuantity = state.cart.reduce(
      (acc, item) => acc + item.quantity,
      0,
    ),
  ) {
    requestAnimationFrame(() => {
      this.querySelector("#go-to-cart-qty").textContent = newQuantity
        ? `(${newQuantity})`
        : "";
    });
    return this;
  }

  outOfStock() {
    this.#quantityInput.disabled = true;
    this.#addToCartButton.disabled = true;
    this.#addToCartButton.textContent = this.getAttribute("outstock")
      .toLowerCase();
  }

  inStock() {
    if (this.currentItem.quantity < this.quantity) {
      this.#quantityInput.value = this.currentItem.quantity;
    }
    this.#quantityInput.disabled = false;
    this.#addToCartButton.disabled = false;
    this.#addToCartButton.textContent = this.getAttribute("addcarttext")
      .toLowerCase();
  }

  updateOptionText({ input, test, alt }) {
    requestAnimationFrame(() =>
      [...input.children].forEach((child) => {
        child.textContent = `${child.textContent.split(" - ")[0]} - (${alt} ${
          state.inv.find((item) => test({ item, child }))
              ?.quantity > 0
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
      test: ({ child, item }) =>
        item.type ===
          `${this.prefix}-${this.color}-${child.value}`,
    });
  }

  updateColorOptionText() {
    return this.updateOptionText({
      input: this.#colorInput,
      alt: this.#sizeInput.value,
      test: ({ child, item }) =>
        item.type ===
          `${this.prefix}-${child.value}-${this.#sizeInput.value}`,
    });
  }

  updateStatus({ inv, currentItem } = state) {
    if (!inv || !this.currentItem) return this;
    requestAnimationFrame(() => {
      if (currentItem) {
        this.#sizeInput.value = currentItem.size;
        this.#colorInput.value = currentItem.color;
        state.currentItem = null;
      }
      this.#needsUpdate = true;
      this.setImage(); // must be before updating currentColor
      this.querySelector("#product-accent").classList.replace(
        `${this.#currentColor}-before`,
        `${this.color}-before`,
      );
      this.#currentColor = this.color;
      this.setProductPriceText();
      this.querySelector("#product-status-text").textContent =
        this.currentItem.quantity <= 0
          ? this.getAttribute("outstock")
          : this.currentItem.quantity < 5
          ? this.getAttribute("fewleft").replace(
            "|",
            this.currentItem.quantity,
          )
          : this.getAttribute("instock");
      !this.currentItem || this.currentItem.quantity <= 0
        ? this.outOfStock()
        : this.inStock();
    });
    return this;
  }
}

customElements.get("zircus-product") ||
  customElements.define("zircus-product", Product);
