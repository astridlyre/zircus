import {
  API_ENDPOINT,
  isError,
  isJson,
  notifyFailure,
  notifySuccess,
  state,
  withLang,
  ZircusElement,
} from "../utils.js";
import paypalIcon from "./paypalIcon.js";
import withAsyncScript from "./withAsyncScript.js";
import cart from "../cart.js";
import OrderData from "../orderData.js";
import ZircusModal from "../modal/modal.js";

const ENDPOINT = `${API_ENDPOINT}/paypal`;
const CLIENT_ID =
  "Aef4eC1Xxfc-wTn_x-wNgMzYB44l7d61xBmi_xB4E_bSFhYjZHsmQudrj8pMB3dn-BxA_cK227PcBzNv";
const PAYPAL_SDK_SRC =
  `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&currency=CAD&enable-funding=venmo`;
const PAYPAL_STYLE = {
  shape: "rect",
  color: "black",
  layout: "horizontal",
  label: "paypal",
  height: window.innerWidth < 1920 ? 44 : window.innerWidth < 2160 ? 50 : 55,
  tagline: false,
};

export default class ZircusPayPal extends HTMLElement {
  #formElement;
  #button;
  #template;
  #text;
  #message;
  #paypalButton;
  #scriptLoaded;

  connectedCallback() {
    this.createInitialElements(); // Create initial elements for our paypal button

    // Listen for custom form submit
    this.#formElement.addEventListener("form-submit", (event) => {
      event.detail.paymentMethod === "paypal" &&
        this.handleSubmit(event.detail);
    });

    if (!this.scriptElementAttached) { // Load PayPal third-party script
      this.loadPaypalScript().then((res) => {
        if (res.ok) this.#scriptLoaded = true;
      });
    } else this.#scriptLoaded = true;
  }

  get scriptElementAttached() { // Return true if paypal script tag has been attached
    return (
      !!document.getElementById("paypal-script") && this.#scriptLoaded
    );
  }

  handleSubmit(orderData) {
    return this.#scriptLoaded
      ? this.showModal().then(() => this.mountPayPalButton({ orderData }))
      : notifyFailure(`PayPal is still loading`);
  }

  async loadPaypalScript() {
    return await this.loadScript({
      src: PAYPAL_SDK_SRC,
      id: "paypal-script",
    });
  }

  showModal() { // Show modal asking to redirect to PayPal
    return Promise.resolve(ZircusModal.show({
      content: this.createPayPalModalElements(),
      heading: this.getAttribute("name"),
      ok: {
        text: this.getAttribute("canceltext"),
        title: this.getAttribute("canceltext"),
        action: () => {
          ZircusModal.close();
          if (state.order?.isCompleted && !cart.length) {
            return document.querySelector("zircus-router").page = withLang({
              en: "/thanks",
              fr: "/fr/merci",
            });
          } else if (state.order) { // Cancel payment intent if order not completed
            return this.cancelPaymentIntent();
          }
        },
      },
    }));
  }

  mountPayPalButton({ orderData }) {
    requestAnimationFrame(() => {
      this.#message.textContent = `Calculated Total: ${
        document.querySelector("#checkout-total").textContent // hacky?
      }`;
      paypal
        .Buttons({
          style: PAYPAL_STYLE,
          createOrder: () => this.createPaymentIntent({ orderData }),
          onApprove: (_, actions) => this.onApprove(_, actions),
        })
        .render("#paypal-button");
    });
  }

  async createPaymentIntent({ orderData }) {
    return await fetch(`${ENDPOINT}/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then(isJson)
      .then(isError)
      .then((orderData) => {
        // Set order details in state
        state.order = new OrderData(orderData);
        return state.order.orderId; // return orderId to client for next step
      }).catch((error) => {
        // If error creating intent, bail
        state.order = null;
        ZircusModal.close();
        notifyFailure(error);
      });
  }

  async cancelPaymentIntent() { // Cancel payment intent & pending order
    return await fetch(
      `${ENDPOINT}/cancel-payment-intent/${state.order.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId: state.orderId }),
      },
    ).then(isJson).then(isError).then(({ response }) => {
      state.order = null;
      notifySuccess(`Payment intent ${response}`);
    }).catch((error) => notifyFailure(`Error: ${error}`));
  }

  handlePaymentSuccess() { // update UI after successful payment
    notifySuccess(
      this.getAttribute("complete").replace("|", state.order.name),
    );
    ZircusModal.setStatus({
      okText: withLang({ en: "close", fr: "fermer" }),
      okTitle: withLang({
        en: "Close modal and finish order",
        fr: "Fermez modal et completez votre commande",
      }),
    });
    return requestAnimationFrame(() => {
      this.#text.textContent = this.getAttribute("success");
      this.#text.classList.add("green");
      this.#paypalButton.textContent = "";
      this.#paypalButton.classList.add("disabled");
      cart.clear();
      state.order.setCompleted();
    });
  }

  handlePaymentFailure() {
    // oh dear - something went wrong
    state.order = null;
    this.#message.textContent = this.getAttribute("failure");
    this.#message.classList.add("red");
    notifyFailure(`Payment failed: ${error}`);
  }

  onApprove(_, actions) { // capture payment
    return actions.order
      .capture()
      .then(() => this.handlePaymentSuccess()) // no error?
      .catch((error) => this.handlePaymentFailure(error));
  }

  createPayPalModalElements(parent = document.createElement("div")) {
    const template = this.#template.content.cloneNode(true);
    this.#paypalButton = template.querySelector("#paypal-button");
    this.#text = template.querySelector("#paypal-text");
    this.#message = template.querySelector("#paypal-message");
    this.#text.textContent = withLang({
      en: "Please continue payment through PayPal order page:",
      fr: "Continuez votre order sur le site PayPal:",
    });
    parent.appendChild(template);
    return parent;
  }

  createInitialElements() {
    this.#template = this.querySelector("template");
    this.#formElement = document.querySelector("zircus-checkout-form");
    this.#button = new ZircusElement("button", "paypal-button", {
      title: this.getAttribute("title"),
      value: "paypal",
      name: this.getAttribute("name"),
    })
      .addChild(
        new ZircusElement("img", null, {
          src: paypalIcon,
        }),
      )
      .render();
    this.appendChild(this.#button);
  }
}

Object.assign(ZircusPayPal.prototype, withAsyncScript());

customElements.get("zircus-paypal") ||
  customElements.define("zircus-paypal", ZircusPayPal);
