import { useEffect } from "react";
import { create } from "zustand";

export const CART_KEY = "microfrontend_cart";

function readCart() {
  try {
    const cart = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

export const useCartStore = create((set, get) => ({
  items: readCart(),

  saveCart(cart) {
    set({ items: cart });
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: cart }));
    return cart;
  },

  addToCart(product) {
    const cart = get().items;
    const existing = cart.find((item) => item.id === product.id);
    const updated = existing
      ? cart.map((item) => item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item)
      : [...cart, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    return get().saveCart(updated);
  },

  removeFromCart(productId) {
    return get().saveCart(get().items.filter((item) => item.id !== productId));
  },

  updateQuantity(productId, quantity) {
    const nextQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
    const updated = get().items.map((item) => item.id === productId
      ? { ...item, quantity: nextQuantity }
      : item);
    return get().saveCart(updated);
  },

  clearCart() {
    return get().saveCart([]);
  },

  syncCart(cart) {
    const updated = Array.isArray(cart) ? cart : readCart();
    if (JSON.stringify(get().items) !== JSON.stringify(updated)) {
      set({ items: updated });
    }
  },
}));

export function useCartSync() {
  const syncCart = useCartStore((state) => state.syncCart);

  useEffect(() => {
    const onCartUpdated = (event) => syncCart(event.detail);
    const onStorage = (event) => {
      if (event.key === CART_KEY || event.key === null) syncCart(readCart());
    };

    window.addEventListener("cart:updated", onCartUpdated);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("cart:updated", onCartUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, [syncCart]);
}
