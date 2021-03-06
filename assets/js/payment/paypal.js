import {
  API_ENDPOINT,
  currency,
  notifyFailure,
  notifySuccess,
  state,
  withLang,
  ZircusElement,
} from "../utils.js";
import paypalIcon from "./paypalIcon.js";
import withAsyncScript from "./withAsyncScript.js";
import withPaymentIntent from "./withPaymentIntent.js";
import cart from "../cart.js";
import ZircusModal from "../modal/modal.js";
import ZircusRouter from "../router/router.js";

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

    this.#formElement.addEventListener(
      "form-filled",
      () => this.#button.disabled = false,
    );

    this.#formElement.addEventListener(
      "form-not-filled",
      () => this.#button.disabled = true,
    );

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
      ? this.showModal().mountPayPalButton({ orderData })
      : notifyFailure(`PayPal is still loading`);
  }

  async loadPaypalScript() {
    return await this.loadScript({
      src: PAYPAL_SDK_SRC,
      id: "paypal-script",
    });
  }

  showModal() { // Show modal asking to redirect to PayPal
    ZircusModal.show({
      content: this.createPayPalModalElements(),
      heading: this.getAttribute("name"),
      ok: {
        text: this.getAttribute("canceltext"),
        title: this.getAttribute("canceltext"),
        action: () => {
          ZircusModal.close();
          if (state.order?.isCompleted && !cart.length) {
            ZircusRouter.navigate(withLang({
              en: "/thanks",
              fr: "/fr/merci",
            }));
          } else if (state.order) { // Cancel payment intent if order not completed
            return this.cancelPaymentIntent();
          }
        },
      },
    });
    return this;
  }

  mountPayPalButton({ orderData }) {
    requestAnimationFrame(() => {
      this.#message.textContent = `Calculated Total: ${
        currency(
          document.querySelector("zircus-cart-totals").getAttribute("total"),
        ) // hacky?
      }`;
      paypal
        .Buttons({
          style: PAYPAL_STYLE,
          createOrder: async () =>
            await this.createPaymentIntent({ orderData }).then((order) =>
              order.orderId
            ).catch(() => ZircusModal.close()),
          onApprove: (_, actions) => this.onApprove(_, actions),
        })
        .render("#paypal-button");
    });
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
      disabled: true,
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

Object.assign(
  ZircusPayPal.prototype,
  withAsyncScript(),
  withPaymentIntent(ENDPOINT),
);

customElements.get("zircus-paypal") ||
  customElements.define("zircus-paypal", ZircusPayPal);
