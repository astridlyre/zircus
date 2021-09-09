import {
  API_ENDPOINT,
  eventBus,
  isError,
  isJson,
  notifyFailure,
  notifySuccess,
} from "./utils.js";
import InventoryItem from "./item.js";

const FIVE_MINUTES = 300_000;

class Inventory {
  #items = [];

  constructor() {
    this.getInventory();
    setInterval(() => this.getInventory(), FIVE_MINUTES);
  }

  // Get Inventory to set max quantities of items
  async getInventory() {
    return await fetch(`${API_ENDPOINT}/inv`)
      .then(isJson)
      .then(isError)
      .then(data => {
        this.#items = data.map(item => new InventoryItem(item));
        eventBus.dispatchEvent(new CustomEvent(this.INV_UPDATED_EVENT));
        notifySuccess("Inventory updated");
      })
      .catch(e => notifyFailure(`Unable to get inventory: ${e.message}`));
  }

  find(type) {
    return this.#items.find(item => item.type === type);
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
