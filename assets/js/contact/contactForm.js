import {
  API_ENDPOINT,
  capitalize,
  isError,
  isJson,
  lang,
  notifyFailure,
  notifySuccess,
} from "../utils.js";
import intText from "../int/intText.js";
import withMapDOM from "../withMapDom.js";
import ZircusModal from "../modal/modal.js";

const { contactText } = intText;

export default class ZircusContactForm extends HTMLElement {
  #dom;
  #formElements;

  connectedCallback() {
    this.#dom = this.mapDOM(this);
    this.#formElements = [
      this.#dom.contactName,
      this.#dom.contactEmail,
      this.#dom.contactButton,
      this.#dom.contactMessage,
    ];

    this.#dom.contactName.addEventListener("input", event => {
      if (event.inputType === "deleteContentBackward" || event.data === " ") {
        return;
      }
      const words = event.target.value.split(" ").map(capitalize);
      event.target.value = words.join(" ");
    });

    this.#dom.contactForm.addEventListener("submit", event => {
      event.preventDefault();

      // this needs to be a for loop
      for (const element of [
        this.#dom.contactName,
        this.#dom.contactEmail,
        this.#dom.contactMessage,
      ]) {
        if (!element.value.length) {
          notifyFailure(this.getAttribute("fields"));
          return element.focus();
        }
      }

      const formData = Object.fromEntries([
        ...new FormData(this.#dom.contactForm),
      ]); // this must be before inputs are disabled

      this.#dom.contactForm.reset();
      this.setBusyState(); // UI feedback

      fetch(`${API_ENDPOINT}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then(isJson)
        .then(isError)
        .then(data => {
          this.handleSuccess(data);
          this.setDoneState();
        })
        .catch(error => {
          this.setDoneState();
          notifyFailure(error);
        });
    });
  }

  handleFailure(error) {
    ZircusModal.show({
      heading: contactText[lang()].error[0],
      content: error,
      ok: {
        text: contactText[lang()].error[1],
        title: contactText[lang()].error[0],
        action: ZircusModal.close,
      },
    });
    return notifyFailure(`${this.getAttribute("failure")}: ${error.message}`);
  }

  handleSuccess(data) {
    ZircusModal.show({
      heading: contactText[lang()].default[0],
      content: contactText[lang()].message(data.name, data.email),
      ok: {
        text: contactText[lang()].default[1],
        title: contactText[lang()].default[2],
        action: ZircusModal.close,
      },
    });
    return notifySuccess(this.getAttribute("success").replace("|", data.name));
  }

  setBusyState() {
    requestAnimationFrame(() => {
      this.#formElements.forEach(element => {
        element.disabled = true;
      });
      this.#dom.contactSpinner.classList.remove("hidden");
      this.#dom.contactButtonText.classList.add("hidden");
    });
  }

  setDoneState() {
    requestAnimationFrame(() => {
      this.#formElements.forEach(element => {
        element.disabled = false;
      });
      this.#dom.contactButtonText.classList.remove("hidden");
      this.#dom.contactSpinner.classList.add("hidden");
    });
  }
}

Object.assign(ZircusContactForm.prototype, withMapDOM());

customElements.get("zircus-contact-form") ||
  customElements.define("zircus-contact-form", ZircusContactForm);
