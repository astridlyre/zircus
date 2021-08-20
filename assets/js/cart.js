import { eventBus } from "./utils.js";
import inventory from "./inventory.js";
import CartItem from "./cartItem.js";

class Cart {
  #items;

  constructor() {
    const savedItems = localStorage.getItem("cart");
    if (savedItems) {
      this.#items = JSON.parse(savedItems).map((item) => new CartItem(item));
    } else {
      this.#items = [];
    }
  }

  get items() {
    return this.#items.slice();
  }

  get length() {
    return this.#items.reduce((acc, item) => acc + item.quantity, 0);
  }

  get total() {
    return this.#items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0,
    );
  }

  add(type, quantity = 1) {
    this.#items = this.#items.concat(
      new CartItem(inventory.find(type).toJSON()).setQuantity(quantity),
    );
    return this.save();
  }

  update(type, updateFunc) {
    this.#items = this.#items.map((item) =>
      item.type === type ? updateFunc(item) : item
    );
    return this.save();
  }

  remove(type) {
    this.#items = this.#items.filter((item) => item.type !== type);
    return this.save();
  }

  find(type) {
    return this.#items.find((item) => item.type === type);
  }

  clear() {
    this.#items = [];
    return this.save();
  }

  save() {
    localStorage.setItem("cart", JSON.stringify(this.#items));
    eventBus.dispatchEvent(new CustomEvent(this.CART_UPDATED_EVENT));
    return this;
  }

  get CART_UPDATED_EVENT() {
    return "cart-updated";
  }
}

const cart = new Cart();
export default cart;
