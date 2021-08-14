import {
  API_ENDPOINT,
  createNotificationFailure,
  createNotificationSuccess,
  isError,
  isJson,
  lang,
  state,
} from "../utils.js";
import intText from "../int/intText.js";

const { contactText } = intText;

export default class ContactForm extends HTMLElement {
  #form;
  #nameInput;
  #emailInput;
  #sendButton;
  #messageText;
  #sendButtonText;
  #spinner;

  connectedCallback() {
    this.#form = this.querySelector("#contact-form");
    this.#nameInput = this.querySelector("#contact-name");
    this.#emailInput = this.querySelector("#contact-email");
    this.#sendButton = this.querySelector("#contact-button");
    this.#messageText = this.querySelector("#contact-message");
    this.#sendButtonText = this.querySelector("#contact-button-text");
    this.#spinner = this.querySelector("#contact-spinner");

    const els = [
      this.#nameInput,
      this.#emailInput,
      this.#sendButton,
      this.#messageText,
    ];

    this.#form.addEventListener("submit", (event) => {
      event.preventDefault();

      for (
        const el of [
          this.#nameInput,
          this.#emailInput,
          this.#messageText,
        ]
      ) {
        if (!el.value.length) {
          createNotificationFailure(this.getAttribute("fields"));
          return el.focus();
        }
      }

      const formData = Object.fromEntries(
        new FormData(this.#form).entries(),
      ); // this must be before inputs are disabled

      els.forEach((el) => {
        el.disabled = true;
      });

      this.busy(); // UI feedback

      fetch(`${API_ENDPOINT}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          formData,
        ),
      })
        .then(isJson)
        .then(isError)
        .then((data) => {
          this.handleSuccess(data);
          this.done();
          els.forEach((el) => {
            el.disabled = false;
            el.value = "";
          });
        })
        .catch((error) => {
          this.done();
          els.forEach((el) => {
            el.disabled = false;
          });
          createNotificationFailure(error);
        });
    });
  }

  handleFailure(error) {
    state.showModal({
      heading: contactText[lang()].error[0],
      content: error,
      ok: {
        text: contactText[lang()].error[1],
        title: contactText[lang()].error[0],
        action: ({ close }) => close(),
      },
    });
    return createNotificationFailure(
      `${this.getAttribute("failure")}: ${error.message}`,
    );
  }

  handleSuccess(data) {
    state.showModal({
      heading: contactText[lang()].default[0],
      content: contactText[lang()].message(data.name, data.email),
      ok: {
        text: contactText[lang()].default[1],
        title: contactText[lang()].default[2],
        action: ({ close }) => close(),
      },
    });
    return createNotificationSuccess(
      this.getAttribute("success").replace("|", data.name),
    );
  }

  busy() {
    requestAnimationFrame(() => {
      this.#spinner.classList.remove("hidden");
      this.#sendButtonText.classList.add("hidden");
    });
  }

  done() {
    requestAnimationFrame(() => {
      this.#sendButtonText.classList.remove("hidden");
      this.#spinner.classList.add("hidden");
    });
  }
}

customElements.get("zircus-contact-form") ||
  customElements.define("zircus-contact-form", ContactForm);
