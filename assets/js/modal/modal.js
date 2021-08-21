import {
  disableElements,
  eventBus,
  setAttributes,
  ZircusElement,
} from "../utils.js";

export default class ZircusModal extends HTMLElement {
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
    eventBus.addEventListener(
      ZircusModal.SHOW_MODAL_EVENT,
      (event) =>
        requestAnimationFrame(() => {
          this.show(event.detail);
          this.#enableElements = disableElements();
        }),
    );
    eventBus.addEventListener(ZircusModal.CLOSE_MODAL_EVENT, () => this.hide());
    eventBus.addEventListener(
      ZircusModal.CHANGE_MODAL_EVENT,
      (event) => this.setStatus(event.detail),
    );
  }

  setStatus({
    isActive = true,
    isSpinning = false,
    okText,
    okTitle,
    cancelText,
    cancelTitle,
  }) {
    return requestAnimationFrame(() => {
      okText && (this.#okText.textContent = okText);
      okTitle && this.#okButton.setAttribute("title", okTitle);
      cancelText && (this.#cancelButton.textContent = cancelText);
      cancelTitle && this.#cancelButton.setAttribute("title", cancelTitle);

      if (isSpinning) {
        this.#okText.classList.add("hidden");
        this.#spinner.classList.remove("hidden");
      } else if (!isSpinning) {
        this.#okText.classList.remove("hidden");
        this.#spinner.classList.add("hidden");
      }
      this.#okButton.disabled = !isActive;
    });
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
    this.#okButton.addEventListener("click", ok.action);

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
      this.#cancelButton.addEventListener("click", cancel.action);
      this.#cancelButton.focus();
    } else {
      this.#okButton.focus();
    }
  }

  static get SHOW_MODAL_EVENT() {
    return "show-modal";
  }

  static get CLOSE_MODAL_EVENT() {
    return "close-modal";
  }

  static get CHANGE_MODAL_EVENT() {
    return "change-modal";
  }

  static close() {
    eventBus.dispatchEvent(new CustomEvent(ZircusModal.CLOSE_MODAL_EVENT));
  }

  static show(detail) {
    eventBus.dispatchEvent(
      new CustomEvent(ZircusModal.SHOW_MODAL_EVENT, {
        detail,
      }),
    );
  }

  static setStatus(detail) {
    eventBus.dispatchEvent(
      new CustomEvent(ZircusModal.CHANGE_MODAL_EVENT, {
        detail,
      }),
    );
  }
}

customElements.get("zircus-modal") ||
  customElements.define("zircus-modal", ZircusModal);
