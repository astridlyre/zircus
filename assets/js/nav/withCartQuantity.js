import cart from "../cart.js";

// Function to update a menu's cart link with current quantity of items
export default function withCartQuantity() {
  return {
    updateCartLink() {
      return cart.length > 0
        ? (this.cartLink.textContent = `${
          this.getAttribute(
            "carttext",
          )
        } (${cart.length})`)
        : (this.cartLink.textContent = this.getAttribute("carttext"));
    },
  };
}
