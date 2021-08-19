import { eventBus } from "../utils.js";

const Template = {
  render() {
    return `${this.html()}
            ${this.css()}`;
  },
  html() {
    return `
<button>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="icon"
  >
    <polyline points="17 11 12 6 7 11"></polyline>
    <polyline points="17 18 12 13 7 18"></polyline>
  </svg>
</button>`;
  },
  css() {
    return `
<style>
  button {
    opacity: 0.5;
    padding: var(--base-unit);
    transform: translateY(15px);
    background: var(--gray-40);
    visibility: hidden;
    border: none;
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    transition: transform 0.2s ease-out;
    position: fixed;
    bottom: var(--base-spacing);
    right: calc(var(--x-padding) - 0.6rem);
    z-index: 30;
  }

  @media screen and (min-width: 901px) {
    button {
      bottom: var(--md-spacing);
      right: var(--md-spacing);
    }
  }

  button:focus,
  button:hover {
    opacity: 1;
    cursor: pointer;
  }

  button.show {
    visibility: unset;
    transform: translateY(0);
    transition: transform 0.2s ease-out;
  }

  svg {
    animation: 3s infinite ease-out slowPulse;
    height: 1.55rem;
    width: 1.55rem;
  }
</style>`;
  },
};

export default class ZircusToTopButton extends HTMLElement {
  #MIN_SCROLL = 400;
  #button;
  #isHidden = true;
  #isUpdating = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = Template.render();
    this.#button = this.shadowRoot.querySelector("button");
    this.#button.addEventListener("click", () => {
      window.scroll({ top: 0 });
      this.#button.blur();
    });
    document.addEventListener(
      "scroll",
      () => this.scrollHandler(window.scrollY > this.#MIN_SCROLL),
    );

    eventBus.addEventListener(
      "menu-open",
      () => !this.isHidden && this.hide(),
    );

    eventBus.addEventListener(
      "menu-closed",
      () => !this.isHidden && this.show(),
    );
  }

  get isHidden() {
    return this.#isHidden;
  }

  set isHidden(value) {
    this.#isHidden = value;
    requestAnimationFrame(() => this.#isHidden ? this.hide() : this.show());
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "tabindex") {
      this.#button.setAttribute("tabindex", newValue);
    }
  }

  static get observedAttributes() {
    return ["tabindex"];
  }

  show() {
    this.#button.classList.add("show");
    this.#isUpdating = false;
  }

  hide() {
    this.#button.classList.remove("show");
    this.#isUpdating = false;
  }

  scrollHandler(shouldShow) {
    if (this.#isUpdating) return;
    this.#isUpdating = true;
    return shouldShow && this.isHidden
      ? (this.isHidden = false)
      : !shouldShow && !this.isHidden
      ? (this.isHidden = true)
      : (this.#isUpdating = false);
  }
}

customElements.get("zircus-to-top-button") ||
  customElements.define("zircus-to-top-button", ZircusToTopButton);
