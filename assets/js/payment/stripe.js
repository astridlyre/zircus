import {
  API_ENDPOINT,
  createNotificationFailure,
  createNotificationSuccess,
  createOrderRequest,
  isError,
  isJson,
  state,
  withLang,
  ZircusElement,
} from "../utils.js";
import withAsyncScript from "./withAsyncScript.js";

const ENDPOINT = `${API_ENDPOINT}/stripe/`;
const src = "https://js.stripe.com/v3/";
const CLIENT_ID =
  "pk_test_51J93KzDIzwSFHzdzCZtyRcjMvw8em0bhnMrVmkBHaMFHuc2nkJ156oJGNxuz0G7W4Jx0R6OCy2nBXYTt6U8bSYew00PIAPcntP";

let stripe = null;

const stripeStyle = {
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

export default function initStripe() {
  class ZircusStripe extends HTMLElement {
    #isLoaded = false;
    #card;
    #modal;
    #textContainer;
    #formElement;
    #paymentPrice;
    #resultMessage;
    #cardElement;
    #setActive;
    #setCustomClose;

    connectedCallback() {
      this.classList.add("stripe-payment-form");
      this.mountElements();
      this.#formElement = document.querySelector("zircus-checkout-form");

      // Listen for custom form submission
      this.#formElement.addEventListener("form-submit", (event) => {
        const { paymentMethod, formData } = event.detail;
        paymentMethod === "stripe" &&
          (stripe
            ? this.createPaymentIntent({ paymentMethod, formData })
            : createNotificationFailure(`Stripe not yet loaded!`));
      });

      // Load stripe third-party script
      this.loadScript({ src, id: "stripe-script" })
        .then((res) => {
          if (res.ok && !res.loaded) {
            stripe = Stripe(CLIENT_ID);
          }
        })
        .catch((error) =>
          createNotificationFailure(`Error loading Stripe: ${error}`)
        );
    }

    disconnectedCallback() {
      this.#isLoaded = false;
      this.#cardElement.classList.add("hidden");
      this.scriptElement?.remove();
    }

    async createPaymentIntent({ paymentMethod, formData }) {
      const { setActive, close } = state.showModal({
        content: this.#modal,
        heading: this.getAttribute("heading"),
        ok: {
          action: ({ setCustomClose }) => {
            this.#setCustomClose = setCustomClose;
            this.payWithCard();
          },
          text: this.getAttribute("buttontext"),
          title: this.getAttribute("buttontext"),
        },
        cancel: {
          action: ({ close, setActive }) => {
            this.handleCardError({ setActive });
            if (!state.order.completed) {
              return this.cancelPaymentIntent({ close });
            }
            close();
            if (!state.cart.length) {
              document.querySelector("zircus-router").page = withLang({
                en: "/thanks",
                fr: "/fr/merci",
              });
            }
          },
          text: this.getAttribute("canceltext"),
          title: "Cancel",
        },
      });
      this.#setActive = setActive;
      this.#setActive({ value: false, spinning: true });
      requestAnimationFrame(() => {
        this.#cardElement.classList.remove("hidden");
      });

      return await fetch(`${ENDPOINT}/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...createOrderRequest({ formData, paymentMethod }),
          clientSecret: state.secret,
        }),
      })
        .then(isJson)
        .then(isError)
        .then(({ error, order, clientSecret }) =>
          !error &&
          this.updateOrderState({ order, clientSecret })
        )
        .catch((error) => {
          close();
          createNotificationFailure(
            `Error Creating Payment Intent: ${error}`,
          );
        });
    }

    async cancelPaymentIntent({ close }) {
      close();
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
          state.order = null;
          createNotificationSuccess("Canceled Stripe Payment-Intent");
        })
        .catch((error) => {
          createNotificationFailure(
            `Unable to cancel Payment Intent: ${
              error.substring(
                0,
                28,
              )
            }...`,
          );
        });
    }

    updateOrderState({ clientSecret, order }) {
      const { id, hasPaid, orderId, name, email, total } = order;
      state.secret = clientSecret;
      state.order = {
        completed: hasPaid,
        orderId,
        name,
        email,
        id,
      };
      this.#paymentPrice.textContent = `Calculated total: $${
        total.toFixed(
          2,
        )
      }`;
      this.#setActive({ value: false });
      return !this.#isLoaded && this.loadStripe({ clientSecret, orderId });
    }

    handleCardError({ message = null } = {}) {
      return message
        ? requestAnimationFrame(() => {
          this.#setActive({ value: false });
          this.#resultMessage.textContent = message;
          this.#resultMessage.classList.remove("hidden");
          this.#resultMessage.classList.add("red");
        })
        : requestAnimationFrame(() => {
          this.#setActive({ value: true });
          this.#resultMessage.classList.add("hidden");
          this.#resultMessage.classList.remove("red");
        });
    }

    loadStripe() {
      const elements = stripe.elements();
      const card = elements.create("card", { style: stripeStyle });
      card.mount("#stripe-card-element");
      card.on("change", (event) => {
        this.#setActive({ value: !event.empty });
        if (event.error) {
          this.handleCardError({
            message: event.error.message,
          });
        } else {
          this.handleCardError();
        }
      });
      this.#card = card;
      this.#isLoaded = true;
    }

    payWithCard() {
      this.#setActive({ value: false, spinning: true });
      return stripe
        .confirmCardPayment(state.secret, {
          payment_method: { card: this.#card },
        })
        .then((result) => {
          if (result.error) {
            return this.handleCardError(result.error.message);
          }
          return this.orderComplete();
        });
    }

    orderComplete() {
      this.#setActive({ value: false, spinning: false });
      state.cart = () => [];
      state.secret = null;
      state.order.completed = true;
      requestAnimationFrame(() => {
        this.#setCustomClose({
          text: withLang({ en: "finish", fr: "complétez" }),
          title: withLang({ en: "finish", fr: "complétez" }),
        });
        this.#cardElement.textContent = "";
        this.#cardElement.classList.add("disabled");
        this.#resultMessage.textContent = this.getAttribute("success");
        this.#resultMessage.classList.replace("hidden", "green");
      });
      createNotificationSuccess(
        this.getAttribute("complete").replace("|", state.order.name),
      );
    }

    mountElements() {
      this.#modal = new ZircusElement("div").render();
      this.#textContainer = new ZircusElement(
        "div",
        "stripe-payment-form-text",
      ).render();
      this.#paymentPrice = new ZircusElement("span", null, {
        id: "stripe-payment-price",
      }).render();
      this.#resultMessage = new ZircusElement(
        "span",
        ["result-message", "hidden"],
        { id: "stripe-result-message" },
      ).render();
      this.#cardElement = new ZircusElement(
        "div",
        ["stripe-payment-form-card", "hidden"],
        { id: "stripe-card-element" },
      ).render();

      this.#textContainer.appendChild(this.#paymentPrice);
      this.#textContainer.appendChild(this.#resultMessage);
      this.#modal.appendChild(this.#textContainer);
      this.#modal.appendChild(this.#cardElement);
      this.appendChild(this.#modal);
    }
  }

  Object.assign(ZircusStripe.prototype, withAsyncScript());

  customElements.get("zircus-stripe") ||
    customElements.define("zircus-stripe", ZircusStripe);
}
