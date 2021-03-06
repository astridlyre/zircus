import { eventBus, lang, ZircusElement } from "../utils.js";
import ZircusRouter from "../router/router.js";

export default class ZircusLangLinks extends HTMLElement {
  #langLinks;

  connectedCallback() {
    this.#langLinks = new ZircusElement("ul", "lang__list").render();
    this.#langLinks.classList.add(this.getAttribute("type"));
    this.appendChild(this.#langLinks);
    this.renderLangLinks();

    eventBus.addEventListener(ZircusRouter.NAVIGATED_EVENT, () => {
      this.#langLinks.textContent = ""; // refresh lang links after navigation
      this.renderLangLinks();
    });
  }

  renderLangLinks() {
    this.getAttribute("langs")
      .split(",")
      .map((language) => [
        language,
        document.querySelector("main").getAttribute(language),
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
    this.appendChild(this.#langLinks);
  }
}

customElements.get("zircus-lang-links") ||
  customElements.define("zircus-lang-links", ZircusLangLinks);
