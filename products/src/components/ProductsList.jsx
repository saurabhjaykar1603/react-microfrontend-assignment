import React, { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import products from "../data/products";
import { addToCart } from "../services/cartService";
import "../styles/products.css";

export default function ProductsList() {
  const [addedId, setAddedId] = useState(null);
  const feedbackTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(feedbackTimer.current), []);

  const handleAdd = (product) => {
    addToCart(product);
    setAddedId(product.id);
    window.clearTimeout(feedbackTimer.current);
    feedbackTimer.current = window.setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <section className="products-section" aria-labelledby="products-title">
      <div className="products-section__heading">
        <div>
          <p className="products-section__eyebrow">CURATED TECH</p>
          <h1 id="products-title">Explore products</h1>
          <p className="products-section__intro">Everyday essentials, ready for your cart.</p>
        </div>
        <span className="products-section__count">{products.length} products</span>
      </div>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={handleAdd}
            isAdded={addedId === product.id}
          />
        ))}
      </div>
      <span className="products-sr-only" role="status" aria-live="polite">
        {addedId !== null ? "Added to cart" : ""}
      </span>
    </section>
  );
}
