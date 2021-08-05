const intText = {
    nav: {
        cartText: {
            en: 'cart',
            fr: 'panier',
        },
    },
    product: {
        addToCart: {
            en: ['out of stock', 'add to cart'],
            fr: ['non disponible', 'ajouter'],
        },
        addNotificationText: item => ({
            en: `Added ${item.name['en']} to cart`,
            fr: `Ajouté des ${item.name['fr']} au panier`,
        }),
        stockText: qty => ({
            en: ['None available', `Only ${qty} left!`, 'In stock'],
            fr: ['Non disponible', `Il n'en reste que ${qty}!`, 'En stock'],
        }),
    },
    cart: {
        removeNotificationText: item => ({
            en: `Removed ${item.name.en} from cart`,
            fr: `${item.name.fr} retiré du panier`,
        }),
        removeBtnText: item => ({
            en: `Remove ${item.name.en} (size: ${item.size} quantity: ${item.quantity}) from cart`,
            fr: `Retirer ${item.name.fr} (taille: ${item.size} quantité: ${item.quantity}) du panier`,
        }),
    },
    checkout: {
        formText: {
            Canada: {
                en: ['Province', 'Postal Code'],
                fr: ['Province', 'Code postal'],
            },
            'United States': {
                en: ['State', 'Zip'],
                fr: ['État', 'Code postal'],
            },
        },
    },
}

export default intText
