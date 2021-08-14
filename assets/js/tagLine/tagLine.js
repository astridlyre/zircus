import { ZircusElement } from "../utils.js";

export default class TagLine extends HTMLElement {
  connectedCallback() {
    this.classList.add("home__heading_container");
    this.appendChild(
      new ZircusElement("h1", "home__heading").addChild(
        new ZircusElement("span").addChild(
          this.getAttribute("taglines").split("|")[
            Math.floor(
              Math.random() * this.getAttribute("taglines").split("|").length,
            )
          ],
        ),
      ).addChild(
        new ZircusElement("span", "teal").addChild("."),
      ).render(),
    );
  }
}

customElements.get("zircus-tag-line") ||
  customElements.define("zircus-tag-line", TagLine);
