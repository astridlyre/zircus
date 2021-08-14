import { lang, ZircusElement } from "../utils.js";

export default class LangLinks extends HTMLElement {
  #links;

  connectedCallback() {
    this.#links = new ZircusElement("ul", "lang__list").render();
    this.#links.classList.add(this.getAttribute("type"));
    this.appendChild(this.#links);
    this.getLangLinks();

    document.addEventListener("navigated", () => {
      this.#links.textContent = ""; // refresh lang links after navigation
      this.getLangLinks();
    });
  }

  getLangLinks() {
    this.getAttribute("langs")
      .split(",")
      .map((lang) => [
        lang,
        document.querySelector("main").getAttribute(lang),
      ])
      .forEach(([key, value]) => {
        const li = document.createElement("li");
        const link = document.createElement("zircus-router-link");
        link.active = () => lang() === key;
        const a = new ZircusElement(
          "a",
          ["small-spaced-bold", "border-hover"],
          {
            href: value,
          },
        ).addChild(key);
        link.appendChild(a.render());
        li.appendChild(link);
        this.#links.appendChild(li);
      });
  }
}

customElements.get("zircus-lang-links") ||
  customElements.define("zircus-lang-links", LangLinks);
