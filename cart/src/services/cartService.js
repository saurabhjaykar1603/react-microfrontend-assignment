export const CART_KEY = "microfrontend_cart";

export function getCart() {
  try {
    const cart = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent("cart:updated", { detail: cart }));
  return cart;
}

export function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  return saveCart(existing
    ? cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
    : [...cart, { id: product.id, name: product.name, price: product.price, quantity: 1 }]
  );
}

export function removeFromCart(productId) {
  return saveCart(getCart().filter((item) => item.id !== productId));
}

export function updateQuantity(productId, quantity) {
  const nextQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
  return saveCart(getCart().map((item) =>
    item.id === productId ? { ...item, quantity: nextQuantity } : item
  ));
}

export function clearCart() {
  return saveCart([]);
}
