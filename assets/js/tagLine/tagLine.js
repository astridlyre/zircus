import { ZircusElement } from "../utils.js";

export default class ZircusTagLine extends HTMLElement {
  connectedCallback() {
    const h1 = new ZircusElement("h1", "tagline__heading");
    const taglines = this.getAttribute("taglines").split("|");
    const span = new ZircusElement("span").addChild(
      taglines[Math.floor(Math.random() * taglines.length)]
    );
    const teal = new ZircusElement("span", "teal").addChild(".");
    requestAnimationFrame(() => {
      this.classList.add("tagline");
      this.appendChild(h1.addChild(span).addChild(teal).render());
    });
  }
}

customElements.get("zircus-tag-line") ||
  customElements.define("zircus-tag-line", ZircusTagLine);
