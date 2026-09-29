import { useCartStore } from "@microfrontend/cart-store";

export const getCart = () => useCartStore.getState().items;
export const saveCart = (cart) => useCartStore.getState().saveCart(cart);
export const addToCart = (product) => useCartStore.getState().addToCart(product);
export const removeFromCart = (productId) => useCartStore.getState().removeFromCart(productId);
export const updateQuantity = (productId, quantity) => useCartStore.getState().updateQuantity(productId, quantity);
export const clearCart = () => useCartStore.getState().clearCart();
