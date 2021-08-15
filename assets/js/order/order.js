import {
  API_ENDPOINT,
  isError,
  isJson,
  notifyFailure,
  notifySuccess,
  state,
  withLang,
  ZircusElement,
} from "../utils.js";

const template = (order) => `
<article class="order">
  <h3 class="order__heading">${
  new Date(order.createdOn).toLocaleDateString()
} - ID: ${order.orderId}</h3>
  <ul class="order__products">
  ${
  order.items.map((item) => `
    <li class="order__product">
      <h5 class="order__product__quantity">${item.quantity}</h5>
      <img class="order__image" src="${item.image}" alt="${item.name}" title="${item.name}" />
      <div class="order__product__container">
        <h4 class="order__product__heading">${item.name} - $${item.price}/ea.</h4>
        <p class="order__product__description">${item.description}</p>
      </div>
    </li>
    `).join("\n")
}
  </ul>
  <div class="order__details">
    <h4>Shipped to</h4>
    <address class="order__address">
${order.name}<br />
${order.email}<br />
${order.phone}<br />
${order.address.line1}<br>
${order.address.line2 ? `${order.address.line2}<br />` : ""}
${order.address.city} ${order.address.state}
${order.address.country} ${order.address.postalCode}
    </address>
    <ul class="order__methods">
      <li class="order__method">Paid by: ${order.paymentMethod}</li>
      <li class="order__method">Shipping: ${order.shipping.method}</li>
      <li class="order__method"><strong>Total: $${order.total}</strong></li>
    </ul>
  </div>
</article>
`;

export default class ZircusOrder extends HTMLElement {
  #searchParams;
  #identifierInput;
  #orderContainer;

  connectedCallback() {
    this.#orderContainer = this.querySelector("#order-container");
    this.#searchParams = Object.fromEntries([
      ...new URLSearchParams(document.location.search),
    ]);
    this.showModal();
  }

  showModal() {
    return state.showModal({
      heading: this.getAttribute("heading"),
      content: this.renderModalElements(),
      cancel: {
        text: this.getAttribute("canceltext"),
        title: this.getAttribute("canceltext"),
        action: ({ closeModal }) => {
          document.querySelector("zircus-router").page = withLang({
            en: "/",
            fr: "/fr",
          });
          closeModal();
          notifyFailure(
            withLang({
              en: "Unable to find order",
              fr: "Impossible de continuer",
            }),
          );
        },
      },
      ok: {
        text: this.getAttribute("oktext"),
        title: this.getAttribute("oktext"),
        action: ({ closeModal, setButtonState }) => {
          setButtonState({ isActive: false, isSpinning: true });
          this.authenticate({
            ...this.#searchParams,
            identifier: this.#identifierInput.value,
          }).then(isJson).then(isError).then((order) => {
            requestAnimationFrame(() => {
              this.#orderContainer.innerHTML = template(order);
            });
            closeModal();
            notifySuccess(this.getAttribute("success"));
          }).catch((error) => {
            setButtonState({ isActive: true });
            notifyFailure(error);
          });
        },
      },
    });
  }

  renderModalElements() {
    const template = this.querySelector("template").content.cloneNode(true);
    const container = new ZircusElement("div").render();
    template.querySelector("span").textContent = this.getAttribute("modaltext");
    template.querySelector("label").setAttribute(
      "title",
      this.getAttribute("label"),
    );
    this.#identifierInput = template.querySelector("input");
    container.appendChild(template);
    return container;
  }

  async authenticate(formData) {
    return await fetch(`${API_ENDPOINT}/orders/${formData.orderId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  }
}

customElements.get("zircus-order") ||
  customElements.define("zircus-order", ZircusOrder);
