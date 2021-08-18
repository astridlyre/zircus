import {
  API_ENDPOINT,
  isError,
  isJson,
  notifyFailure,
  notifySuccess,
  state,
  toOrderData,
  withLang,
} from "../utils.js";
import withAsyncScript from "./withAsyncScript.js";

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
  #setButtonState;

  connectedCallback() {
    this.classList.add("stripe-payment-form");
    this.#modal = this.createInitialElements(); // create modal elements
    this.#formElement = document.querySelector("zircus-checkout-form");

    // Listen for custom form submission
    this.#formElement.addEventListener("form-submit", (event) => {
      const { paymentMethod, formData } = event.detail;
      paymentMethod === "stripe" &&
        (stripe // if global exists, we're loaded
          ? this.showModal().then(({ closeModal, setButtonState }) =>
            this.createPaymentIntent({
              paymentMethod,
              formData,
              closeModal,
              setButtonState,
            })
          )
          : notifyFailure(`Stripe not yet loaded!`));
    });

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

  async showModal() {
    return await Promise.resolve(state.showModal({
      content: this.#modal,
      heading: this.getAttribute("heading"),
      ok: {
        action: ({ setCustomCloseText }) => {
          this.confirmCardPayment({ setCustomCloseText }); // pay with card
        },
        text: this.getAttribute("buttontext"),
        title: this.getAttribute("buttontext"),
      },
      cancel: {
        action: ({ closeModal, setButtonState }) => {
          this.setErrorMessage({ setButtonState }); // cancel
          closeModal();
          if (state.order.completed && !state.cart.length) {
            return document.querySelector("zircus-router").page = withLang({
              en: "/thanks",
              fr: "/fr/merci",
            });
          }
          return this.cancelPaymentIntent({ closeModal });
        },
        text: this.getAttribute("canceltext"),
        title: this.getAttribute("canceltext"),
      },
    }));
  }

  async createPaymentIntent(
    { paymentMethod, formData, setButtonState, closeModal },
  ) {
    this.#setButtonState = setButtonState; // set private prop because we use this so much
    this.#setButtonState({ isActive: false, isSpinning: true });
    requestAnimationFrame(() => {
      this.#cardElement.classList.remove("hidden");
    });
    return await fetch(`${ENDPOINT}/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...toOrderData({ formData, paymentMethod }),
        clientSecret: state.secret,
      }),
    })
      .then(isJson)
      .then(isError)
      .then(({ order, clientSecret }) =>
        this.setPendingOrderState({ order, clientSecret })
      )
      .catch((error) => {
        closeModal();
        notifyFailure(
          `Error Creating Payment Intent: ${error}`,
        );
      });
  }

  async cancelPaymentIntent({ closeModal }) {
    closeModal(); // close modal
    await fetch(`${ENDPOINT}/cancel-payment-intent/${state.order.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientSecret: state.secret,
        orderId: state.order.orderId,
      }),
    })
      .then(isJson)
      .then(isError)
      .then(() => {
        state.order = null; // clear order
        notifySuccess("Canceled Stripe Payment-Intent");
      })
      .catch((error) => {
        notifyFailure(
          `Unable to cancel Payment Intent: ${
            error.substring(
              0,
              24,
            )
          }...`,
        );
      });
  }

  setPendingOrderState({ clientSecret, order }) {
    const { id, hasPaid, orderId, name, email, total, identifier } = order;
    state.secret = clientSecret;
    state.order = {
      completed: hasPaid,
      orderId,
      name,
      email,
      id,
      identifier,
    };
    this.#paymentPrice.textContent = `Calculated total: $${
      total.toFixed(
        2,
      )
    }`;
    this.#setButtonState({ isActive: false });
    !this.#isMounted && this.mountStripeElements(); // load mount stripe elements if not loaded
  }

  setErrorMessage({ message = null } = {}) {
    return message
      ? requestAnimationFrame(() => {
        this.#setButtonState({ isActive: false });
        this.#resultMessage.textContent = message;
        this.#resultMessage.classList.remove("hidden");
        this.#resultMessage.classList.add("red");
      })
      : requestAnimationFrame(() => {
        this.#setButtonState({ isActive: true });
        this.#resultMessage.classList.add("hidden");
        this.#resultMessage.classList.remove("red");
      });
  }

  mountStripeElements(
    elements = stripe.elements(),
    card = elements.create("card", { style: STRIPE_STYLE }),
  ) {
    card.mount("#stripe-card-element");
    card.on("change", (event) => {
      this.#setButtonState({ isActive: !event.empty });
      return event.error
        ? this.setErrorMessage({
          message: event.error.message,
        })
        : this.setErrorMessage();
    });
    this.#card = card; // card element
    this.#isMounted = true; // stripe is now loaded
  }

  confirmCardPayment({ setCustomCloseText }) {
    this.#setButtonState({ isActive: false, isSpinning: true });
    return stripe
      .confirmCardPayment(state.secret, {
        payment_method: { card: this.#card },
      })
      .then((result) => {
        if (result.error) {
          return this.setErrorMessage(result.error.message);
        }
        return this.handlePaymentSuccess({ setCustomCloseText });
      });
  }

  handlePaymentSuccess({ setCustomCloseText }) {
    this.#setButtonState({ isActive: false, isSpinning: false });
    state.cart = () => [];
    state.secret = null;
    state.order.completed = true;
    requestAnimationFrame(() => {
      setCustomCloseText({
        text: withLang({ en: "finish", fr: "complétez" }),
        title: withLang({ en: "finish", fr: "complétez" }),
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

Object.assign(ZircusStripe.prototype, withAsyncScript());

customElements.get("zircus-stripe") ||
  customElements.define("zircus-stripe", ZircusStripe);
