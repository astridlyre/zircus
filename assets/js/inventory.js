import {
  API_ENDPOINT,
  eventBus,
  isError,
  isJson,
  notifyFailure,
  notifySuccess,
} from "./utils.js";

const FIVE_MINUTES = 300_000;

class Inventory {
  #items;

  constructor() {
    const savedItems = localStorage.getItem("inventory");
    if (savedItems) {
      this.#items = JSON.parse(savedItems);
    } else {
      this.#items = [];
    }

    this.getInventory();
    setInterval(() => this.getInventory(), FIVE_MINUTES);
  }

  // Get Inventory to set max quantities of items
  async getInventory() {
    return await fetch(`${API_ENDPOINT}/inv`)
      .then(isJson).then(isError)
      .then((data) => {
        this.#items = [...data.cf, ...data.pf, ...data.ff];
        return this.save();
      })
      .catch((e) => notifyFailure(`Unable to get inventory: ${e.message}`));
  }

  find(type) {
    return this.#items.find((item) => item.type === type);
  }

  save() {
    localStorage.setItem("inventory", JSON.stringify(this.#items));
    eventBus.dispatchEvent(new CustomEvent(this.INV_UPDATED_EVENT));
    notifySuccess("Inventory updated");
  }

  get length() {
    return this.#items.length;
  }

  get INV_UPDATED_EVENT() {
    return "inv-updated";
  }
}

const inventory = new Inventory();
export default inventory;
