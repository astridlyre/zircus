import { lang } from "./utils.js";
import cart from "./cart.js";

/*
  * OrderData is the data-type for sending order details to the Zircus backend
  * API.
  *
*/
export default class OrderData {
  #address;
  #breakdown;
  #capture;
  #email;
  #id;
  #identifier;
  #isCompleted = false;
  #items;
  #name;
  #orderId;
  #paymentMethod;
  #phone;
  #preferredLanguage;
  #shipping;
  #subtotal;
  #total;

  constructor(
    {
      address,
      breakdown = null,
      capture = null,
      email,
      identifier = null,
      id = null,
      items = cart.items.map((item) => ({
        type: item.type,
        quantity: item.quantity,
      })),
      name,
      orderId = null,
      paymentMethod,
      phone,
      shipping,
      subtotal = cart.total,
      total = null,
    },
  ) {
    this.#address = address;
    this.#breakdown = breakdown;
    this.#capture = capture;
    this.#email = email;
    this.#identifier = identifier;
    this.#id = id;
    this.#items = items;
    this.#name = name;
    this.#orderId = orderId;
    this.#paymentMethod = paymentMethod;
    this.#phone = phone;
    this.#preferredLanguage = lang();
    this.#shipping = shipping;
    this.#subtotal = subtotal;
    this.#total = total;
  }

  get address() {
    return this.#address;
  }
  get breakdown() {
    return this.#breakdown;
  }
  get capture() {
    return this.#capture;
  }
  get email() {
    return this.#email;
  }
  get identifier() {
    return this.#identifier;
  }
  get id() {
    return this.#id;
  }
  get items() {
    return this.#items;
  }
  get name() {
    return this.#name;
  }
  get orderId() {
    return this.#orderId;
  }
  get paymentMethod() {
    return this.#paymentMethod;
  }
  get phone() {
    return this.#phone;
  }
  get preferredLanguage() {
    return this.#preferredLanguage;
  }
  get shipping() {
    return this.#shipping;
  }
  get subtotal() {
    return this.#subtotal;
  }
  get total() {
    return this.#total;
  }
  get isCompleted() {
    return this.#isCompleted;
  }

  setCompleted() {
    this.#isCompleted = true;
    return this;
  }

  toJSON() {
    return {
      address: this.address,
      breakdown: this.breakdown,
      capture: this.capture,
      email: this.email,
      identifier: this.identifier,
      id: this.id,
      isCompleted: this.isCompleted,
      items: this.items,
      name: this.name,
      orderId: this.orderId,
      paymentMethod: this.paymentMethod,
      phone: this.phone,
      preferredLanguage: this.preferredLanguage,
      shipping: this.shipping,
      subtotal: this.subtotal,
      total: this.total,
    };
  }

  [Symbol.iterator] = function* () {
    for (const [key, val] of Object.entries(this.toJSON())) {
      yield [key, val];
    }
  };
}
