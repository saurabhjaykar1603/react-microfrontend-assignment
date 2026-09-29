import { useEffect } from "react";
import { create } from "zustand";

export const CART_KEY = "microfrontend_cart";
const BRIDGE_ORIGIN = "http://localhost:3000";
let bridgeFrame = null;
let bridgeReady = false;
let pendingCart = null;

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
    if (window.location.origin !== BRIDGE_ORIGIN) {
      pendingCart = cart;
      if (bridgeReady && bridgeFrame?.contentWindow) {
        bridgeFrame.contentWindow.postMessage(
          { type: "cart:bridge:write", cart: pendingCart },
          BRIDGE_ORIGIN
        );
        pendingCart = null;
      }
    }
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

// Standalone remotes use a hidden Host-origin frame to share its localStorage.
export function useCartBridge() {
  useEffect(() => {
    if (window.location.origin === BRIDGE_ORIGIN) return undefined;

    const frame = document.createElement("iframe");
    frame.src = `${BRIDGE_ORIGIN}/cart-bridge.html`;
    frame.title = "Cart synchronization";
    frame.tabIndex = -1;
    frame.style.display = "none";
    bridgeFrame = frame;
    bridgeReady = false;

    const onMessage = (event) => {
      if (
        event.origin !== BRIDGE_ORIGIN ||
        event.source !== frame.contentWindow ||
        event.data?.type !== "cart:bridge:state" ||
        !Array.isArray(event.data.cart)
      ) return;

      bridgeReady = true;
      if (pendingCart) {
        frame.contentWindow.postMessage(
          { type: "cart:bridge:write", cart: pendingCart },
          BRIDGE_ORIGIN
        );
        pendingCart = null;
        return;
      }

      const cart = event.data.cart;
      if (JSON.stringify(readCart()) !== JSON.stringify(cart)) {
        window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
      }
      useCartStore.getState().syncCart(cart);
      window.dispatchEvent(new CustomEvent("cart:updated", { detail: cart }));
    };

    const onLoad = () => {
      frame.contentWindow.postMessage({ type: "cart:bridge:read" }, BRIDGE_ORIGIN);
    };

    window.addEventListener("message", onMessage);
    frame.addEventListener("load", onLoad);
    document.body.appendChild(frame);

    return () => {
      window.removeEventListener("message", onMessage);
      frame.removeEventListener("load", onLoad);
      frame.remove();
      if (bridgeFrame === frame) {
        bridgeFrame = null;
        bridgeReady = false;
      }
    };
  }, []);
}
