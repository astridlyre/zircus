const icon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
stroke="currentColor" stroke-width="2" stroke-linecap="round"
stroke-linejoin="round" class="icon">
  <line x1="5" y1="12" x2="19" y2="12"></line>
  <polyline points="12 5 19 12 12 19"></polyline>
</svg>
`;

export default class ZircusScrollIcon extends HTMLElement {
  connectedCallback() {
    this.innerHTML = icon;

    document.addEventListener(
      "scrolled-to-heading",
      () => this.handleScrolled(),
    );
  }

  disconnectedCallback() {
    document.removeEventListener(
      "scrolled-to-heading",
      () => this.handleScrolled(),
    );
  }

  handleScrolled() {
    requestAnimationFrame(() => {
      this.classList.add("show");
      document.addEventListener("scroll", () => this.classList.remove("show"), {
        once: true,
      });
    });
  }
}

customElements.get("zircus-scroll-icon") ||
  customElements.define("zircus-scroll-icon", ZircusScrollIcon);
