import {
  API_ENDPOINT,
  currency,
  notifyFailure,
  notifySuccess,
  state,
  withLang,
} from "../utils.js";
import withAsyncScript from "./withAsyncScript.js";
import withPaymentIntent from "./withPaymentIntent.js";
import cart from "../cart.js";
import ZircusModal from "../modal/modal.js";
import ZircusRouter from "../router/router.js";

const ENDPOINT = `${API_ENDPOINT}/stripe/`;
const STRIPE_SDK_SRC = "https://js.stripe.com/v3/";
const CLIENT_ID =
  "pk_test_51J93KzDIzwSFHzdzCZtyRcjMvw8em0bhnMrVmkBHaMFHuc2nkJ156oJGNxuz0G7W4Jx0R6OCy2nBXYTt6U8bSYew00PIAPcntP";

let stripe = null; // A "global" variable, I'm naughty

const STRIPE_STYLE = {
  base: {
    color: "#211b22",
    fontFamily: "Nunito, sans-serif",
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#8b808f",
    },
  },
  invalid: {
    fontFamily: "Nunito, sans-serif",
    color: "#8f3342",
    iconColor: "#8f3342",
  },
};

export default class ZircusStripe extends HTMLElement {
  #isMounted = false;
  #card;
  #modal;
  #formElement;
  #paymentPrice;
  #resultMessage;
  #cardElement;
  #button;

  connectedCallback() {
    this.classList.add("stripe-payment-form");
    this.#modal = this.createInitialElements(); // create modal elements
    this.#formElement = document.querySelector("zircus-checkout-form");
    this.#button = this.#formElement.querySelector("#pay-with-card");

    // Listen for custom form submission
    this.#formElement.addEventListener("form-submit", (event) => {
      event.detail.paymentMethod === "stripe" &&
        (stripe // if global exists, we're loaded
          ? this.showModal().createPaymentIntent({ orderData: event.detail })
            .then(() => this.mountStripe())
          : notifyFailure(`Stripe not yet loaded!`));
    });

    this.#formElement.addEventListener(
      "form-filled",
      () => this.#button.disabled = false,
    );
    this.#formElement.addEventListener(
      "form-not-filled",
      () => this.#button.disabled = true,
    );

    // Load stripe third-party script
    if (!this.scriptLoaded) {
      this.loadScript({ src: STRIPE_SDK_SRC, id: "stripe-script" })
        .then((res) => {
          if (res.ok && !res.loaded) {
            stripe = Stripe(CLIENT_ID); // set global stripe variable
          }
        })
        .catch((error) => notifyFailure(`Error loading Stripe: ${error}`));
    }
  }

  disconnectedCallback() {
    this.#isMounted = false;
    this.#cardElement.classList.add("hidden");
  }

  get scriptLoaded() { // Return true if script element exists and global stripe is not null
    return !!document.getElementById("stripe-script") && stripe;
  }

  showModal() {
    ZircusModal.show({
      content: this.#modal,
      heading: this.getAttribute("heading"),
      ok: {
        action: () => this.confirmCardPayment(), // pay with card
        text: this.getAttribute("buttontext"),
        title: this.getAttribute("buttontext"),
      },
      cancel: {
        action: () => {
          this.setErrorMessage(); // cancel
          ZircusModal.close();
          if (state.order?.isCompleted && !cart.length) {
            return ZircusRouter.navigate(withLang({
              en: "/thanks",
              fr: "/fr/merci",
            }));
          }
          return this.cancelPaymentIntent();
        },
        text: this.getAttribute("canceltext"),
        title: this.getAttribute("canceltext"),
      },
    });
    ZircusModal.setStatus({ isActive: false, isSpinning: true });
    requestAnimationFrame(() => {
      this.#cardElement.classList.remove("hidden");
    });
    return this;
  }

  setErrorMessage({ message = null } = {}) {
    return message
      ? requestAnimationFrame(() => {
        ZircusModal.setStatus({ isActive: false });
        this.#resultMessage.textContent = message;
        this.#resultMessage.classList.remove("hidden");
        this.#resultMessage.classList.add("red");
      })
      : requestAnimationFrame(() => {
        ZircusModal.setStatus({ isActive: true });
        this.#resultMessage.classList.add("hidden");
        this.#resultMessage.classList.remove("red");
      });
  }

  mountStripe() {
    this.#paymentPrice.textContent = `Calculated total: ${
      currency(state.order.total)
    }`;
    ZircusModal.setStatus({ isActive: false });
    !this.#isMounted && this.mountStripeElements(); // load mount stripe elements if not loaded
  }

  mountStripeElements(
    elements = stripe.elements(),
    card = elements.create("card", { style: STRIPE_STYLE }),
  ) {
    card.mount("#stripe-card-element");
    card.on("change", (event) => {
      ZircusModal.setStatus({ isActive: !event.empty });
      return event.error
        ? this.setErrorMessage({
          message: event.error.message,
        })
        : this.setErrorMessage();
    });
    this.#card = card; // card element
    this.#isMounted = true; // stripe is now loaded
  }

  confirmCardPayment() {
    ZircusModal.setStatus({ isActive: false, isSpinning: true });
    return stripe
      .confirmCardPayment(state.secret, {
        payment_method: { card: this.#card },
      })
      .then((result) => {
        if (result.error) {
          return this.setErrorMessage(result.error.message);
        }
        return this.handlePaymentSuccess();
      });
  }

  handlePaymentSuccess() {
    cart.clear();
    state.secret = null;
    state.order.setCompleted();
    requestAnimationFrame(() => {
      ZircusModal.setStatus({
        isActive: false,
        isSpinning: false,
        cancelText: withLang({ en: "finish", fr: "complétez" }),
        cancelTitle: withLang({ en: "finish", fr: "complétez" }),
      });
      this.#cardElement.textContent = "";
      this.#cardElement.classList.add("disabled");
      this.#resultMessage.textContent = this.getAttribute("success");
      this.#resultMessage.classList.replace("hidden", "green");
    });
    notifySuccess(
      this.getAttribute("complete").replace("|", state.order.name),
    );
  }

  createInitialElements(parent = document.createElement("div")) {
    const template = this.querySelector("template").content.cloneNode(true);
    this.#paymentPrice = template.querySelector("#stripe-payment-price");
    this.#cardElement = template.querySelector("#stripe-card-element");
    this.#resultMessage = template.querySelector("#stripe-result-message");
    parent.appendChild(template);
    return parent;
  }
}

Object.assign(
  ZircusStripe.prototype,
  withAsyncScript(),
  withPaymentIntent(ENDPOINT),
);

customElements.get("zircus-stripe") ||
  customElements.define("zircus-stripe", ZircusStripe);
