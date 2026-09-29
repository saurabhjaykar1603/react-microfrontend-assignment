import React, { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";

const ProductsList = React.lazy(() => import("products/ProductsList"));
const CartList = React.lazy(() => import("cart/CartList"));

function RemoteSection({ children, loadingMessage }) {
  const location = useLocation();

  return (
    <ErrorBoundary key={location.pathname}>
      <Suspense fallback={<p className="app-message">{loadingMessage}</p>}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route
            path="/products"
            element={
              <RemoteSection loadingMessage="Loading products...">
                <ProductsList />
              </RemoteSection>
            }
          />
          <Route
            path="/cart"
            element={
              <RemoteSection loadingMessage="Loading cart...">
                <CartList />
              </RemoteSection>
            }
          />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
