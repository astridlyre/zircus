import {
  API_ENDPOINT,
  isError,
  isJson,
  notifyFailure,
  notifySuccess,
  state,
  withLang,
} from "../utils.js";
import ZircusModal from "../modal/modal.js";

const template = (order) => `
<article class="order">
  <p class="order__heading small-spaced-bold">${
  new Date(order.createdOn).toLocaleDateString()
} - ID: ${order.orderId}</p>
  <ul class="order__products">
  ${
  order.items.map((item) => `
    <li class="order__product">
      <h5 class="order__product__quantity">${item.quantity}</h5>
      <img class="order__image" src="${item.image}" alt="${item.name}" title="${item.name}" />
      <div class="order__product__container">
        <hp class="order__product__description">${item.name} - $${item.price}/ea.</hp>
      </div>
    </li>
    `).join("\n")
}
  </ul>
  <div class="order__details">
    <h4>${withLang({ en: "Status", fr: "État" })}: ${
  order.hasShipped
    ? withLang({ en: "shipped", fr: "expédié" })
    : withLang({ en: "not yet shipped", fr: "pas encore expédié" })
}</h4>
    <address class="order__address">
<strong>${order.name}</strong><br />
${order.email}<br />
${order.phone}<br />
${order.address.line1}<br>
${order.address.line2 ? `${order.address.line2}<br />` : ""}
${order.address.city} ${order.address.state}<br />
${order.address.country} ${order.address.postalCode}
    </address>
    <ul class="order__methods">
      <li class="order__method">${
  withLang({ en: "Paid by", fr: "Payé par" })
}: ${order.paymentMethod[0]
  .toUpperCase() + order.paymentMethod.substring(1)}</li>
      <li class="order__method">${
  withLang({ en: "Shipping", fr: "Expédition" })
}: ${order.shipping.method[0]
  .toUpperCase() + order.shipping.method.substring(1)}</li>
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
    if (this.#searchParams.email && this.#searchParams.orderId) {
      this.showModal();
    } else {
      this.handleFailure();
    }
  }

  handleFailure() {
    document.querySelector("zircus-router").page = withLang({
      en: "/",
      fr: "/fr",
    });
    ZircusModal.close();
    notifyFailure(
      withLang({
        en: "Unable to find order",
        fr: "Impossible de continuer",
      }),
    );
  }

  showModal() {
    return ZircusModal.show({
      heading: this.getAttribute("heading"),
      content: this.renderModalElements(),
      cancel: {
        text: this.getAttribute("canceltext"),
        title: this.getAttribute("canceltext"),
        action: this.handleFailure,
      },
      ok: {
        text: this.getAttribute("oktext"),
        title: this.getAttribute("oktext"),
        action: () => {
          ZircusModal.setStatus({ isActive: false, isSpinning: true });
          this.authenticate({
            ...this.#searchParams,
            identifier: this.#identifierInput.value,
          }).then(isJson).then(isError).then((order) => {
            requestAnimationFrame(() => {
              this.#orderContainer.innerHTML = template(order);
            });
            ZircusModal.close();
            notifySuccess(this.getAttribute("success"));
          }).catch((error) => {
            ZircusModal.setStatus({ isActive: true });
            notifyFailure(error);
          });
        },
      },
    });
  }

  renderModalElements(container = document.createElement("div")) {
    const template = this.querySelector("template").content.cloneNode(true);
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
