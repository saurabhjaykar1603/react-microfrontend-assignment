import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const CART_KEY = "microfrontend_cart";

function readCartCount() {
  try {
    const cart = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(cart)
      ? cart.reduce((count, item) => count + (Number(item.quantity) || 0), 0)
      : 0;
  } catch {
    return 0;
  }
}

export default function Navbar() {
  const [cartCount, setCartCount] = useState(readCartCount);

  useEffect(() => {
    const syncCartCount = () => setCartCount(readCartCount());
    const onStorage = (event) => {
      if (event.key === CART_KEY || event.key === null) syncCartCount();
    };

    window.addEventListener("cart:updated", syncCartCount);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("cart:updated", syncCartCount);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink className="site-brand" to="/products" aria-label="Storefront home">
          <span className="site-brand__mark">S</span>
          <span>Storefront</span>
        </NavLink>
        <nav className="site-nav" aria-label="Main navigation">
          <NavLink to="/products" className={({ isActive }) => `site-nav__link${isActive ? " is-active" : ""}`}>
            Products
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => `site-nav__link${isActive ? " is-active" : ""}`}>
            Cart <span className="site-nav__count">{cartCount}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
