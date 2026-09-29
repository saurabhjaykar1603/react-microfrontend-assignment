import React from "react";

const formatPrice = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <article className="cart-item">
      <div className="cart-item__visual" aria-hidden="true">{item.name.charAt(0)}</div>
      <div className="cart-item__info">
        <h2>{item.name}</h2>
        <p>{formatPrice.format(item.price)} each</p>
        <button type="button" className="cart-item__remove" onClick={() => onRemove(item.id)}>
          Remove
        </button>
      </div>
      <div className="cart-item__actions">
        <div className="cart-item__quantity" aria-label={`Quantity for ${item.name}`}>
          <button
            type="button"
            aria-label={`Decrease quantity of ${item.name}`}
            disabled={item.quantity <= 1}
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          >−</button>
          <span>{item.quantity}</span>
          <button
            type="button"
            aria-label={`Increase quantity of ${item.name}`}
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          >+</button>
        </div>
        <strong>{formatPrice.format(item.price * item.quantity)}</strong>
      </div>
    </article>
  );
}
