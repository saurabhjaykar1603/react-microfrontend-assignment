import React from "react";
import { NavLink } from "react-router-dom";
import { useCartStore, useCartSync } from "@microfrontend/cart-store";

export default function Navbar() {
  useCartSync();
  const cartCount = useCartStore((state) =>
    state.items.reduce((count, item) => count + item.quantity, 0)
  );

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
