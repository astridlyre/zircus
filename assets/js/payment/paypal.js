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
import paypalIcon from "./paypalIcon.js";
import withAsyncScript from "./withAsyncScript.js";

const ENDPOINT = `${API_ENDPOINT}/paypal`;
const CLIENT_ID =
  "Aef4eC1Xxfc-wTn_x-wNgMzYB44l7d61xBmi_xB4E_bSFhYjZHsmQudrj8pMB3dn-BxA_cK227PcBzNv";
const src = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}`;

const paypalStyle = {
  shape: "rect",
  color: "black",
  layout: "horizontal",
  label: "paypal",
  height: window.innerWidth < 1920 ? 44 : window.innerWidth < 2160 ? 50 : 55,
  tagline: false,
};

export default function initPaypal() {
  class ZircusPayPal extends HTMLElement {
    #formElement;
    #button;
    #template;
    #text;
    #message;
    #paymentComplete = false;
    #paypalButton;
    #scriptLoaded;

    connectedCallback() {
      this.createElements();

      // Listen for custom form submit
      this.#formElement.addEventListener("form-submit", (event) => {
        event.detail.paymentMethod === "paypal" &&
          this.handleSubmit(event.detail);
      });

      // Load PayPal third-party script
      if (!this.loaded) {
        this.loadPaypal().then((res) => {
          if (res.ok) this.#scriptLoaded = true;
        });
      } else this.#scriptLoaded = true;
    }

    get loaded() {
      return (
        !!document.getElementById("paypal-script") && this.#scriptLoaded
      );
    }

    handleSubmit({ paymentMethod, formData }) {
      return this.#scriptLoaded
        ? this.showModal().then(({ close }) =>
          this.mountPayPal({
            formData,
            paymentMethod,
            close,
          })
        )
        : createNotificationFailure(`PayPal is still loading`);
    }

    async loadPaypal() {
      return await this.loadScript({
        src: `${src}&currency=CAD&enable-funding=venmo`,
        id: "paypal-script",
      });
    }

    showModal() {
      return Promise.resolve(state.showModal({
        content: this.mountElements(),
        heading: this.getAttribute("name"),
        ok: {
          text: this.getAttribute("canceltext"),
          title: this.getAttribute("canceltext"),
          action: ({ close }) => {
            close();
            this.#paymentComplete &&
              (document.querySelector("zircus-router").page = withLang({
                en: "/thanks",
                fr: "/fr/merci",
              }));
          },
        },
      }));
    }

    async mountPayPal({ formData, paymentMethod, close }) {
      const orderData = createOrderRequest({ formData, paymentMethod });
      const { amount } = await this.getTotal({ orderData });
      if (!amount) return close();
      requestAnimationFrame(() => {
        this.#message.textContent = `Calculated Total: $${amount.value}`;
        paypal
          .Buttons({
            style: paypalStyle,
            createOrder: (_, actions) =>
              actions.order.create({
                purchase_units: [
                  {
                    amount,
                  },
                ],
              }),
            onApprove: (data, actions) =>
              this.onApprove(data, actions, orderData),
          })
          .render("#paypal-button");
      });
    }

    async getTotal({ orderData }) {
      return await fetch(`${ENDPOINT}/validate-price`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })
        .then(isJson)
        .then(isError)
        .catch((error) => {
          createNotificationFailure(
            `Form validation failed: ${error}`,
          );
          return error;
        });
    }

    changeButtonText() {
      const button = document.getElementById("modal-button-text");
      button.textContent = withLang({
        en: "close",
        fr: "fermer",
      });
      button.setAttribute(
        "title",
        withLang({
          en: "Close modal and finish order",
          fr: "Fermez modal et completez votre commande",
        }),
      );
    }

    async createPaymentIntent({ orderData, orderId, amount }) {
      return await fetch(`${ENDPOINT}/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...orderData,
          orderId,
          amount,
        }),
      })
        .then(isJson)
        .then(isError);
    }

    async handleCapture({ res, orderData }) {
      const capture = res.purchase_units[0].payments.captures[0];
      return await this.createPaymentIntent({
        orderData,
        orderId: capture.id,
        amount: capture.amount,
      })
        .then((order) => {
          if (order.error) {
            throw new Error(order.error);
          } else {
            this.handleSuccess({ order });
          }
        })
        .catch((error) => createNotificationFailure(`Capture Error: ${error}`));
    }

    handleSuccess({ order }) {
      createNotificationSuccess(
        this.getAttribute("complete").replace("|", order.name),
      );
      return requestAnimationFrame(() => {
        this.#text.textContent = this.getAttribute("success");
        this.#text.classList.add("green");
        this.#paypalButton.textContent = "";
        this.#paypalButton.classList.add("disabled");
        this.#paymentComplete = true;
        this.changeButtonText();
        state.cart = () => [];
        state.order = {
          name: order.name,
          email: order.email,
          orderId: order.orderId,
        };
      });
    }

    onApprove(_, actions, orderData) {
      return actions.order
        .capture()
        .then(async (res) => await this.handleCapture({ res, orderData }))
        .catch((e) => {
          this.#message.textContent = this.getAttribute("failure");
          this.#message.classList.add("red");
          createNotificationFailure(`Payment failed: ${e}`);
        });
    }

    mountElements(parent = document.createElement("div")) {
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

    createElements() {
      this.#template = document.querySelector("#paypal-template");
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
}
