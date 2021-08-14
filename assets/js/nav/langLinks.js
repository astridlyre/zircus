import { lang, ZircusElement } from "../utils.js";

export default class ZircusLangLinks extends HTMLElement {
  #langLinks;

  connectedCallback() {
    this.#langLinks = new ZircusElement("ul", "lang__list").render();
    this.#langLinks.classList.add(this.getAttribute("type"));
    this.appendChild(this.#langLinks);
    this.renderLangLinks();

    document.addEventListener("navigated", () => {
      this.#langLinks.textContent = ""; // refresh lang links after navigation
      this.renderLangLinks();
    });
  }

  renderLangLinks() {
    this.getAttribute("langs")
      .split(",")
      .map((language) => [
        language,
        document.querySelector("main").getAttribute(lang),
      ])
      .forEach(([language, href]) => {
        const li = document.createElement("li");
        const routerLink = document.createElement("zircus-router-link");
        routerLink.active = () => lang() === language;
        const anchor = new ZircusElement(
          "a",
          ["small-spaced-bold", "border-hover"],
          {
            href,
          },
        ).addChild(language);
        routerLink.appendChild(anchor.render());
        li.appendChild(routerLink);
        this.#langLinks.appendChild(li);
      });
  }
}

customElements.get("zircus-lang-links") ||
  customElements.define("zircus-lang-links", ZircusLangLinks);
