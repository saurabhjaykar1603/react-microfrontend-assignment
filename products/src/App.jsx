import React from "react";
import { useCartBridge } from "@microfrontend/cart-store";
import ProductsList from "./components/ProductsList";

export default function App() {
  useCartBridge();

  return (
    <main className="standalone-container">
      <ProductsList />
    </main>
  );
}
