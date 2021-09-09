export default class ZircusProductAccent extends HTMLElement {
  #parent;
  #dom;
  #currentColor;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = Template.render();
    this.#dom = Template.mapDOM(this.shadowRoot);
  }

  connectedCallback() {
    this.#parent = document.querySelector("zircus-product");
    this.handleUpdate();
    this.#parent.addEventListener(
      "wants-update",
      ({ detail }) => detail.images && this.handleUpdate()
    );
  }

  get color() {
    return this.#parent.color;
  }

  handleUpdate() {
    this.#currentColor
      ? this.#dom.accent.classList.replace(this.#currentColor, this.color)
      : this.#dom.accent.classList.add(this.color);
    this.#currentColor = this.color;
  }
}

const Template = {
  html: () => `
  <div id="accent"></div>
  `,
  css: () =>
    `<style>
:host { position: absolute; z-index: -1; width: 100%; }
#accent.black { background: var(--dark); }
#accent.teal { background: var(--teal); }
#accent.yellow { background: var(--gold); }
#accent.purple { background: var(--purple); }
#accent.stripe {
  border: 2px solid var(--dark);
  background-image: repeating-linear-gradient(
    45deg,
    var(--dark),
    var(--dark) 3rem,
    var(--light) 3rem,
    var(--light) 6rem
  );
}
#accent {
  z-index: -1;
  top: 2rem;
  left: -8rem;
  width: 35rem;
  height: 35rem;
  border-radius: 100%;
  position: absolute;
}
@media screen and (min-width: 601px) {
  #accent { display: block; }
}
@media screen and (min-width: 901px) {
  #accent { top: -12rem; right: -4rem; left: unset; }
}
@media screen and (min-width: 1281px) {
  #accent { right: 8rem; width: 40rem; height: 40rem; }
}
@media screen and (min-width: 1921px) {
  #accent { top: -12rem; right: 0rem; width: 45rem; height: 45rem; }
}
</style>`,
  render() {
    return `${this.html()}${this.css()}`;
  },
  mapDOM: scope => ({
    accent: scope.querySelector("#accent"),
  }),
};

customElements.get("zircus-product-accent") ||
  customElements.define("zircus-product-accent", ZircusProductAccent);
