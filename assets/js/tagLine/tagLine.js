import { ZircusElement } from "../utils.js";

export default function tagLine() {
  class TagLine extends HTMLElement {
    connectedCallback() {
      this.tagLines = this.getAttribute("taglines").split("|");

      const heading = new ZircusElement("h1", "home__heading");
      heading.addChild(
        new ZircusElement("span").addChild(
          this.tagLines[
            Math.floor(Math.random() * this.tagLines.length)
          ],
        ),
      );
      heading.addChild(new ZircusElement("span", "teal").addChild("."));

      this.classList.add("home__heading_container");
      this.appendChild(heading.render());
    }
  }

  customElements.get("zircus-tag-line") ||
    customElements.define("zircus-tag-line", TagLine);
}
