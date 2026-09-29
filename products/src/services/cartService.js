import { useCartStore } from "@microfrontend/cart-store";

export const addToCart = (product) => useCartStore.getState().addToCart(product);
