import {
  disableElements,
  setAttributes,
  state,
  ZircusElement,
} from "../utils.js";

export default class ZircusModal extends HTMLElement {
  #isActive = false;
  #modal;
  #okText;
  #okButton;
  #cancelButton;
  #content;
  #heading;
  #spinner;
  #template;
  #enableElements;

  connectedCallback() {
    this.#modal = new ZircusElement("div", "modal__container").render();
    this.#template = this.querySelector("template");
    this.appendChild(this.#modal);
    state._setModalFunction((modal) => {
      requestAnimationFrame(() => this.show(modal));
      this.#enableElements = disableElements();
      return {
        setButtonState: (value) => (this.isActive = value),
        closeModal: () => this.hide(),
      };
    });
  }

  set isActive({ isActive, isSpinning = false }) {
    requestAnimationFrame(() => {
      this.#isActive = isActive;
      if (isSpinning) {
        this.#okText.classList.add("hidden");
        this.#spinner.classList.remove("hidden");
      } else if (!isSpinning) {
        this.#okText.classList.remove("hidden");
        this.#spinner.classList.add("hidden");
      }
      if (this.#isActive) {
        this.#okButton.disabled = false;
      } else {
        this.#okButton.disabled = true;
      }
    });
  }

  get isActive() {
    return this.#isActive;
  }

  hide() {
    requestAnimationFrame(() => {
      if (typeof this.#enableElements === "function") {
        this.#enableElements();
      }
      this.#modal.textContent = "";
      document.getElementById("blur").classList.remove("blur");
      document.getElementById("nav").classList.remove("blur");
      document.body.classList.remove("hide-y");
      this.classList.add("hidden");
    });
  }

  show({ content, ok, heading, cancel }) {
    const template = this.#template.content.cloneNode(true);
    this.#heading = template.querySelector("#modal-heading");
    this.#content = template.querySelector("#modal-content");
    this.#okButton = template.querySelector("#modal-ok");
    this.#okText = template.querySelector("#modal-button-text");
    this.#cancelButton = template.querySelector("#modal-cancel");
    this.#spinner = template.querySelector("#modal-spinner");

    this.#heading.textContent = heading;
    this.#heading.setAttribute("aria-hidden", false);

    if (typeof content === "string") {
      this.#content.appendChild(
        new ZircusElement("p", "modal__text")
          .addChild(content)
          .render(),
      );
    } else if (
      content instanceof HTMLElement || content instanceof DocumentFragment
    ) {
      this.#content.appendChild(content);
    }

    this.#okText.textContent = ok.text;
    setAttributes(this.#okButton, {
      title: ok.title,
      "aria-hidden": false,
    });

    this.#okButton.addEventListener(
      "click",
      () => ok.action(this.createActionResponse(this.#cancelButton)),
    );

    document.getElementById("blur").classList.add("blur");
    document.getElementById("nav").classList.add("blur");
    document.body.classList.add("hide-y");
    this.classList.remove("hidden");
    this.#modal.appendChild(template);

    if (cancel) {
      this.#okButton.classList.add("grow");
      this.#cancelButton.classList.replace("hidden", "grow");
      this.#cancelButton.textContent = cancel.text;
      setAttributes(this.#cancelButton, {
        title: cancel.title,
        "aria-hidden": false,
      });
      this.#cancelButton.addEventListener(
        "click",
        () => cancel.action(this.createActionResponse(this.#cancelButton)),
      );
      this.#cancelButton.focus();
    } else {
      this.#okButton.focus();
    }
  }

  createActionResponse(cancelButton) {
    return {
      setButtonState: (value) => this.isActive = value,
      closeModal: () => this.hide(),
      setCustomCloseText: (cancel) => {
        cancelButton.textContent = cancel.text;
        cancelButton.setAttribute("title", cancel.title);
      },
    };
  }
}

customElements.get("zircus-modal") ||
  customElements.define("zircus-modal", ZircusModal);
