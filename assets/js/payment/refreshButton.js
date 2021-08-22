import { ZircusElement } from "../utils.js";

const span = `<span>get shipping quotes</span>`;
const icon =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
`;
export default class ZircusRefreshButton extends HTMLElement {
  #button;

  connectedCallback() {
    this.#button = new ZircusElement(
      "button",
      ["btn", "btn__icon", "bg-lgrey", "dark"],
      {
        title: "Get shipping quotes",
        value: "shipping",
        type: "submit",
        name: "Get shipping quotes",
      },
    ).render();
    this.#button.innerHTML = span;
    this.appendChild(this.#button);
  }

  set icon(val) {
    if (val) {
      this.#button.innerHTML = icon;
    } else this.#button.innerHTML = span;
  }
}

customElements.get("zircus-refresh-button") ||
  customElements.define("zircus-refresh-button", ZircusRefreshButton);
