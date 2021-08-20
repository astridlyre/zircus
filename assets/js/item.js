export default class InventoryItem {
  #color;
  #description;
  #images;
  #name;
  #prefix;
  #price;
  #quantity;
  #size;
  #type;

  constructor(
    {
      color,
      description,
      images,
      name,
      prefix,
      price,
      quantity,
      size,
      type,
    },
  ) {
    this.#color = color;
    this.#description = description;
    this.#images = images;
    this.#name = name;
    this.#prefix = prefix;
    this.#price = price;
    this.#quantity = quantity;
    this.#size = size;
    this.#type = type;
  }

  get color() {
    return this.#color;
  }
  get description() {
    return this.#description;
  }
  get images() {
    return {
      ...this.#images,
    };
  }
  get name() {
    return this.#name;
  }
  get prefix() {
    return this.#prefix;
  }
  get price() {
    return this.#price;
  }
  get quantity() {
    return this.#quantity;
  }
  get size() {
    return this.#size;
  }
  get type() {
    return this.#type;
  }

  toJSON() {
    return {
      color: this.color,
      description: this.description,
      images: this.images,
      name: this.name,
      prefix: this.prefix,
      price: this.price,
      quantity: this.quantity,
      size: this.size,
      type: this.type,
    };
  }

  [Symbol.iterator] = function* () {
    for (const entry of Object.entries(this.toJSON())) {
      yield entry;
    }
  };
}
