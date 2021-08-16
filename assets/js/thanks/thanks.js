import { state, withLang, ZircusElement } from "../utils.js";

const thanksText = {
  en: (order) => `
<p>Thanks, ${order.name}! Your order has been recieved and you should get a confirmation 
email sent to <kbd>${order.email}</kbd> within a few minutes with your 
order information.</p>

<p>Important order information:</p>
<ul>
  <li>Your unique three-word identifier is <kbd>${order.identifier}</kbd>
  (save this, because you'll need it to view your order status)</li>
  <li>Your order ID is <kbd>${order.orderId}</kbd></li>
</ul>

<p>Once your order ships, you will recieve a tracking number, along with a 
link to view the status of your order. For customer support, or if you have any 
questions, please contact us at <a href="mailto:support@zircus.ca">support@zircus.ca</a>.</p>
`,
  fr: (order) => `
<p>Merci, ${order.name}! Votre commande a été reçue et vous
devrait obtenir un courriel de confirmation (envoyé à <kbd>${order.email}</kbd>)
dans quelques minutes avec vos informations de commande.</p>

<p>Information important:</p>
<ul>
  <li>Votre identifiant unique de commande est <kbd>${order.identifier}</kbd>.</li>
  <li>Votre order ID est <kbd>${order.orderId}</li>
</ul>

<p>Une fois votre commande expédiée, vous recevrez un numéro de suivi, ainsi qu'un lien 
pour voir l'état de votre commande. Dans le cas des soutien à la clientèle, ou si vous 
avez des questions, veuillez nous contacter à <a href="mailto:support@zircus.ca">
support@zircus.ca</a>.</p>
`,
};

export default class Thanks extends HTMLElement {
  #text;

  connectedCallback() {
    const { order } = state;
    !order && (document.querySelector("zircus-router").page = "/");
    this.#text = new ZircusElement("div").render();
    this.#text.innerHTML = withLang(thanksText)(order);
    this.appendChild(this.#text);
  }
}

customElements.get("zircus-thanks") ||
  customElements.define("zircus-thanks", Thanks);
