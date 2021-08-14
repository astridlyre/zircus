import { ZircusElement } from "../utils.js";

export default class ZircusRouterPageLink extends HTMLElement {
  #link;

  connectedCallback() {
    this.#link = new ZircusElement("a", null, {
      href: `#${this.getAttribute("href")}`,
      title: this.getAttribute("title"),
    }).addChild(this.getAttribute("text")).render();
    this.appendChild(this.#link);

    this.#link.addEventListener("click", (event) => this.clicked(event));
  }

  disconnectedCallback() {
    this.#link.removeEventListener("click", (event) => this.clicked(event));
  }

  clicked(event) {
    event.preventDefault();
    const target = document.getElementById(this.getAttribute("href"));
    target.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
    document.dispatchEvent(new CustomEvent("scrolled-to-heading"));
  }
}

customElements.get("zircus-router-page-link") ||
  customElements.define("zircus-router-page-link", ZircusRouterPageLink);
