import React from "react";

const formatPrice = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function ProductCard({ product, onAdd, isAdded }) {
  return (
    <article className="product-card">
      <div className="product-card__visual" aria-hidden="true">
        <span>{product.name.charAt(0)}</span>
      </div>
      <div className="product-card__content">
        <p className="product-card__category">{product.category}</p>
        <h2>{product.name}</h2>
        <p className="product-card__price">{formatPrice.format(product.price)}</p>
        <button type="button" className="product-card__button" onClick={() => onAdd(product)}>
          {isAdded ? "Added to cart ✓" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}
