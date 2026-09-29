import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";
import { CART_KEY, clearCart, getCart, removeFromCart, updateQuantity } from "../services/cartService";
import "../styles/cart.css";

const formatPrice = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function CartList() {
  const [cart, setCart] = useState(getCart);

  useEffect(() => {
    const syncCart = () => setCart(getCart());
    const onStorage = (event) => {
      if (event.key === CART_KEY || event.key === null) syncCart();
    };

    window.addEventListener("cart:updated", syncCart);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("cart:updated", syncCart);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="cart-section" aria-labelledby="cart-title">
      <div className="cart-section__heading">
        <div>
          <p className="cart-section__eyebrow">YOUR SELECTION</p>
          <h1 id="cart-title">Shopping cart</h1>
          <p>Review and update your items below.</p>
        </div>
        {cart.length > 0 && (
          <button type="button" className="cart-section__clear" onClick={clearCart}>Clear cart</button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty__icon" aria-hidden="true">○</div>
          <h2>Your cart is empty.</h2>
          <p>Add products from the Products page to get started.</p>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>
          <aside className="cart-summary" aria-label="Order summary">
            <h2>Order summary</h2>
            <div className="cart-summary__row"><span>Total items</span><strong>{totalItems}</strong></div>
            <div className="cart-summary__total"><span>Grand total</span><strong>{formatPrice.format(grandTotal)}</strong></div>
          </aside>
        </div>
      )}
    </section>
  );
}
