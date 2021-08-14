import {
  API_ENDPOINT,
  notifyFailure,
  notifySuccess,
  isError,
  isJson,
  lang,
  state,
} from "../utils.js";
import intText from "../int/intText.js";

const { contactText } = intText;

export default class ZircusContactForm extends HTMLElement {
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

    const formElements = [
      this.#nameInput,
      this.#emailInput,
      this.#sendButton,
      this.#messageText,
    ];

    this.#form.addEventListener("submit", (event) => {
      event.preventDefault();

      for (
        const element of [
          this.#nameInput,
          this.#emailInput,
          this.#messageText,
        ]
      ) {
        if (!element.value.length) {
          notifyFailure(this.getAttribute("fields"));
          return element.focus();
        }
      }

      const formData = Object.fromEntries(
        new FormData(this.#form).entries(),
      ); // this must be before inputs are disabled

      formElements.forEach((element) => {
        element.disabled = true;
      });

      this.setBusyState(); // UI feedback

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
          this.setDoneState();
          formElements.forEach((element) => {
            element.disabled = false;
            element.value = "";
          });
        })
        .catch((error) => {
          this.setDoneState();
          formElements.forEach((element) => {
            element.disabled = false;
          });
          notifyFailure(error);
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
        action: ({ closeModal }) => closeModal(),
      },
    });
    return notifyFailure(
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
        action: ({ closeModal }) => closeModal(),
      },
    });
    return notifySuccess(
      this.getAttribute("success").replace("|", data.name),
    );
  }

  setBusyState() {
    requestAnimationFrame(() => {
      this.#spinner.classList.remove("hidden");
      this.#sendButtonText.classList.add("hidden");
    });
  }

  setDoneState() {
    requestAnimationFrame(() => {
      this.#sendButtonText.classList.remove("hidden");
      this.#spinner.classList.add("hidden");
    });
  }
}

customElements.get("zircus-contact-form") ||
  customElements.define("zircus-contact-form", ZircusContactForm);
