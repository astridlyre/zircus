const intText = {
  cart: {
    removeNotificationText: (item) => ({
      en: `Removed ${item.name.en} from cart`,
      fr: `${item.name.fr} retiré du panier`,
    }),
    removeBtnText: (item) => ({
      en:
        `Remove ${item.name.en} (size: ${item.size} quantity: ${item.quantity}) from cart`,
      fr:
        `Retirer ${item.name.fr} (taille: ${item.size} quantité: ${item.quantity}) du panier`,
    }),
  },
  checkout: {
    formText: {
      Canada: {
        en: ["Province", "Postal Code"],
        fr: ["Province", "Code postal"],
      },
      "United States": {
        en: ["State", "Zip"],
        fr: ["État", "Code postal"],
      },
    },
    modalText: {
      en: {
        okText: "go to shop",
        okTitle: "Visit the Zircus Shop",
        heading: "Empty cart",
        content: "No products in shopping cart. Why not add some?",
      },
      fr: {
        okText: "boutique",
        okTitle: "Visitez la boutique Zircus",
        heading: "Panier vide",
        content:
          "Aucun produit dans le panier d'achat. Pourquoi ne pas en ajouter?",
      },
    },
  },
  contactText: {
    en: {
      error: ["Error", "ok"],
      default: ["Success", "ok", "Close modal", "cancel", "Cancel"],
      message: (name, email) =>
        `Thanks for your message, ${name}! We'll get back to you at ${email} as soon as possible.`,
    },
    fr: {
      error: ["Error", "ok"],
      default: [
        "Succès",
        "ok",
        "Fermer la fenêtre contextuelle",
        "annuler",
        "Annuler",
      ],
      message: (name, email) =>
        `Merci pour votre message ${name}! Nous vous rappelleons à votre courriel ${email} dans les plus brefs délais.`,
    },
  },
  redirect: {
    en: "Visit our site in English?",
    fr: "Visitez notre site en Français?",
  },
};

export default intText;
