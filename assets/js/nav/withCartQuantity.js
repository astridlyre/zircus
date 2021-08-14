import { state } from "../utils.js";

// Function to update a menu's cart link with current quantity of items
export default function withCartQuantity() {
  return {
    updateCartLink() {
      return state.cart.length > 0
        ? (this.cartLink.textContent = `${
          this.getAttribute(
            "carttext",
          )
        } (${
          state.cart.reduce(
            (acc, item) => acc + item.quantity,
            0,
          )
        })`)
        : (this.cartLink.textContent = this.getAttribute("carttext"));
    },
  };
}
