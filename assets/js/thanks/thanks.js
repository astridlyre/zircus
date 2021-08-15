import { state, withLang, ZircusElement } from "../utils.js";

const thanksText = {
  en: (name, email, identifier) => `
Thanks, <span id="user-name">${name}</span>! Your order has been recieved and you
should get a confirmation email sent to <kbd id="user-email">${email}</kbd> within a
few minutes with your order information. Your unique order identifier is
<kbd id="order-id">${identifier}</kbd> (save this, because you'll need it to view your
order status. Once your order ships, you will recieve a tracking number, along with a 
link to view the status of your order. For customer support, or if you have any 
questions, please contact us at <a href="mailto:support@zircus.ca">support@zircus.ca</a>.
`,
  fr: (name, email, identifier) => `
Merci, <span id="user-name">${name}</span>! Votre commande a été reçue et vous
devrait obtenir un courriel de confirmation (envoyé à <kbd id="user-email">${email}</kbd>)
dans quelques minutes avec vos informations de commande. Votre identifiant unique 
de commande est <kbd id="order-id">${identifier}</kbd>. Une fois votre commande
expédiée, vous recevrez un numéro de suivi, ainsi qu'un lien pour voir l'état de
votre commande. Dans le cas des soutien à la clientèle, ou si vous avez des
questions, veuillez nous contacter à <a href="mailto:support@zircus.ca">support@zircus.ca</a>.
`,
};

export default class Thanks extends HTMLElement {
  #text;

  connectedCallback() {
    const { identifier, name, email } = state.order;
    !state.order && (document.querySelector("zircus-router").page = "/");
    this.#text = new ZircusElement("p").render();
    this.#text.innerHTML = withLang(thanksText)(name, email, identifier);
    this.appendChild(this.#text);
  }
}

customElements.get("zircus-thanks") ||
  customElements.define("zircus-thanks", Thanks);
