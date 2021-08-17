import { eventBus } from "../utils.js";
import ZircusRouter from "./router.js";

export default class ZircusRouterLink extends HTMLElement {
  #link;
  #isActive = false;
  #activeFunction;

  constructor() {
    super();
    this.#activeFunction = () => window.location.href.includes(this.#link.href);
  }

  connectedCallback() {
    this.#link = this.querySelector("a");
    this.#link.addEventListener("pointerenter", () => this.hovered(), {
      once: true,
    });
    this.#link.addEventListener("focus", () => this.hovered(), {
      once: true,
    });
    this.#link.addEventListener("click", (event) => this.clicked(event));
    eventBus.addEventListener(
      ZircusRouter.NAVIGATED_EVENT,
      () => this.setStatus(),
    );
    this.setStatus();
  }

  disconnectedCallback() {
    this.#link.removeEventListener("click", (event) => this.clicked(event));
  }

  set isActive(value) {
    this.#isActive = value;
    this.#isActive
      ? this.#link.classList.add("active")
      : this.#link.classList.remove("active");
  }

  get isActive() {
    return this.#isActive;
  }

  set active(func) {
    this.#activeFunction = func;
  }

  get active() {
    return this.#activeFunction;
  }

  setStatus() {
    this.#activeFunction() ? (this.isActive = true) : (this.isActive = false);
  }

  clicked(event) {
    event.preventDefault();
    document.querySelector("zircus-router").page = this.#link.href;
  }

  hovered() {
    eventBus.dispatchEvent(
      new CustomEvent("preload", { detail: this.#link.href }),
    );
  }
}

customElements.get("zircus-router-link") ||
  customElements.define("zircus-router-link", ZircusRouterLink);
