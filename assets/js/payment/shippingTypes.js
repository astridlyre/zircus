const shippingTypes = {
  overnight: {
    name: {
      en: "Overnight",
      fr: "Expédition de nuit",
    },
    price: 29.99,
    default: false,
  },
  standard: {
    name: {
      en: "Standard",
      fr: "Expédition standard",
    },
    price: 9.99,
    default: true,
  },
  economy: {
    name: {
      en: "Economy",
      fr: "Expédition économique",
    },
    price: 5.99,
    default: false,
  },
};

export default shippingTypes;
