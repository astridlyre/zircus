import { ZircusElement } from "../utils.js";

export default function SkipToContent() {
  class SkipButton extends HTMLElement {
    #button;

    constructor() {
      super();
      this.#button = new ZircusElement("button", [
        "skip-to-content",
        "small-spaced-bold",
      ]).render();
      this.appendChild(this.#button);
    }

    focusMain() {
      document.getElementById("main-content").focus();
    }

    connectedCallback() {
      this.#button.setAttribute("title", this.getAttribute("text"));
      this.#button.textContent = this.getAttribute("text");
      this.#button.addEventListener("click", this.focusMain);
    }

    disconnectedCallback() {
      this.#button.removeEventListener("click", this.focusMain);
    }
  }

  customElements.get("zircus-skip-to-content") ||
    customElements.define("zircus-skip-to-content", SkipButton);
}
