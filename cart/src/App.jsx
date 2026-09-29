import React from "react";
import { useCartBridge } from "@microfrontend/cart-store";
import CartList from "./components/CartList";

export default function App() {
  useCartBridge();

  return (
    <main className="standalone-container">
      <CartList />
    </main>
  );
}
