import {
  isError,
  isJson,
  notifyFailure,
  notifySuccess,
  state,
  withLang,
} from "../utils.js";
import OrderData from "../orderData.js";

class PaymentIntentCreationError extends Error {
  constructor(message) {
    super(message);
  }
}

class PaymentIntentCancellationError extends Error {
  constructor(message) {
    super(message);
  }
}

export default function withPaymentIntent(ENDPOINT) {
  return {
    async createPaymentIntent({ orderData }) {
      return await fetch(`${ENDPOINT}/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })
        .then(isJson)
        .then(isError)
        .then(({ orderData, clientSecret }) => {
          state.secret = clientSecret;
          state.order = new OrderData(orderData);
          return state.order;
        })
        .catch((error) => {
          state.order = null;
          notifyFailure(
            withLang({
              en: `Error creating payment intent: ${error}`,
              fr: `Erreur de création de l'intention de paiement ${error}`,
            }),
          );
          throw new PaymentIntentCreationError(error);
        });
    },

    async cancelPaymentIntent() {
      await fetch(`${ENDPOINT}/cancel-payment-intent/${state.order.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientSecret: state.secret,
          orderId: state.order.orderId,
        }),
      })
        .then(isJson)
        .then(isError)
        .then(() => {
          state.order = null; // clear order
          notifySuccess(
            withLang({
              en: "Cancelled payment intent",
              fr: "Intention de paiement annulée",
            }),
          );
        })
        .catch((error) => {
          notifyFailure(
            withLang({
              en: `Unable to cancel Payment Intent: ${error.substring(0, 24)}`,
              fr: `Impossible d'annuler l'intention de paiement: ${
                error.substring(0, 24)
              }`,
            }),
          );
          throw new PaymentIntentCancellationError(error);
        });
    },
  };
}
