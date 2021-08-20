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
  #createdOn;
  #email;
  #hasShipped;
  #hasPaid;
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
      createdOn = null,
      email,
      hasPaid = false,
      hasShipped = false,
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
    this.#createdOn = createdOn;
    this.#email = email;
    this.#hasPaid = hasPaid;
    this.#hasShipped = hasShipped;
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
    return {
      ...this.#address,
    };
  }
  get breakdown() {
    return {
      ...this.#breakdown,
    };
  }
  get capture() {
    return this.#capture;
  }
  get createdOn() {
    return this.#createdOn;
  }
  get email() {
    return this.#email;
  }
  get hasPaid() {
    return this.#hasPaid;
  }
  get hasShipped() {
    return this.#hasShipped;
  }
  get identifier() {
    return this.#identifier;
  }
  get id() {
    return this.#id;
  }
  get items() {
    return this.#items.map((item) => ({ ...item }));
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
    return {
      ...this.#shipping,
    };
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
      createdOn: this.createdOn,
      email: this.email,
      hasPaid: this.hasPaid,
      hasShipped: this.hasShipped,
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
    for (const entry of Object.entries(this.toJSON())) {
      yield entry;
    }
  };
}
