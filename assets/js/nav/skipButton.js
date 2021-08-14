import { ZircusElement } from "../utils.js";

export default class ZircusSkipButton extends HTMLElement {
  #button;

  connectedCallback() {
    this.#button = new ZircusElement("button", [
      "skip-to-content",
      "small-spaced-bold",
    ], {
      title: this.getAttribute("text"),
    }).event("click", this.focusMain).render();
    this.appendChild(this.#button);
    this.#button.textContent = this.getAttribute("text");
  }

  disconnectedCallback() {
    this.#button.removeEventListener("click", this.focusMain);
  }

  focusMain() {
    document.getElementById("main-content").focus();
  }
}

customElements.get("zircus-skip-button") ||
  customElements.define("zircus-skip-button", ZircusSkipButton);
