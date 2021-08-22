const Template = {
  render() {
    return `${this.html()}
            ${this.css()}`;
  },
  html() {
    return `
    <button></button>
    `;
  },
  css() {
    return `
    <style>
      button {
        position: fixed;
        top: -120%;
        left: 0;
        z-index: 1000;
        border-bottom-right-radius: var(--radius);
        background: var(--light);
        color: var(--dark);
        outline: none;
        border: 2px solid transparent;
        transition: all 0.1s ease-out;
        padding: var(--base-unit) var(--base-spacing);
        font-size: var(--small-font-size);
        font-family: var(--site-font-family);
        font-weight: 600;
        letter-spacing: var(--letter-spacing);
        box-shadow: var(--box-shadow-sm);
      }

      button:hover {
        cursor: pointer;
      }

      button:focus {
        top: 0;
        transition: all 0.1s ease-out;
        border-color: var(--teal);
      }
    </style>
    `;
  },
};

export default class ZircusSkipButton extends HTMLElement {
  #button;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = Template.render();
    this.#button = this.shadowRoot.querySelector("button");
    this.#button.addEventListener("click", this.focusMain);
  }

  connectedCallback() {
    this.#button.setAttribute("title", this.getAttribute("text"));
    this.#button.textContent = this.getAttribute("text");
  }

  disconnectedCallback() {
    this.#button.removeEventListener("click", this.focusMain);
  }

  focusMain() {
    document.getElementById("main-content").focus();
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "tabindex") {
      this.#button.setAttribute("tabindex", newValue);
    }
  }

  static get observedAttributes() {
    return ["tabindex"];
  }
}

customElements.get("zircus-skip-button") ||
  customElements.define("zircus-skip-button", ZircusSkipButton);
