# React Microfrontend Assignment

A small storefront built from three independently runnable React applications in one repository. The host loads the Products and Cart screens at runtime with Webpack 5 Module Federation.

## Architecture

| Application | URL | Responsibility |
| --- | --- | --- |
| Host | http://localhost:3000 | Navigation, routing, remote loading, cart badge, and error handling |
| Products remote | http://localhost:3001 | Product catalog and add-to-cart actions |
| Cart remote | http://localhost:3002 | Cart contents, quantities, removal, and totals |

## Technology Stack

React 18, React DOM, React Router DOM 7, Zustand 5, Webpack 5, Webpack Dev Server, Babel, HTML Webpack Plugin, CSS, `localStorage`, browser events, and `concurrently`.

## Project Structure

```text
react-microfrontend-assignment/
├── host/
│   ├── public/index.html
│   ├── src/components/{Navbar,ErrorBoundary}.jsx
│   ├── src/styles/global.css
│   ├── src/{index.js,bootstrap.js,App.jsx}
│   ├── package.json
│   └── webpack.config.js
├── products/
│   ├── public/index.html
│   ├── src/components/{ProductsList,ProductCard}.jsx
│   ├── src/data/products.js
│   ├── src/services/cartService.js
│   ├── src/styles/{products,standalone}.css
│   ├── src/{index.js,bootstrap.js,App.jsx}
│   ├── package.json
│   └── webpack.config.js
├── cart/
│   ├── public/index.html
│   ├── src/components/{CartList,CartItem}.jsx
│   ├── src/services/cartService.js
│   ├── src/styles/{cart,standalone}.css
│   ├── src/{index.js,bootstrap.js,App.jsx}
│   ├── package.json
│   └── webpack.config.js
├── shared/
│   ├── src/index.js             # Zustand cart store and browser-event sync
│   └── package.json
├── package.json
└── .gitignore
```

## Installation

Requires Node.js and npm. From a new clone:

```bash
git clone <repository>
cd react-microfrontend-assignment
npm install
npm run install:all
npm run start
```

Open http://localhost:3000. The `/` route redirects to `/products`. All three development servers need to be running for both host routes to load.

## Individual Apps

```bash
npm run start:host
npm run start:products
npm run start:cart
```

Run each command in a separate terminal when developing apps individually. `npm run build` builds all three apps in production mode.

## Microfrontend Architecture

The host imports `products/ProductsList` and `cart/CartList` through `React.lazy`. Each remote publishes an exposed component through its own `remoteEntry.js`, which Webpack loads from port 3001 or 3002 when that route is opened. The remotes can also render their components independently at their own root URLs. Only the host owns a `BrowserRouter`.

Each app loads its React entry through an asynchronous `bootstrap.js` import so Webpack can initialize shared modules before rendering. React, React DOM, React Router DOM, and `@microfrontend/cart-store` are configured as singleton shared dependencies. The local shared package also works when either remote runs on its own.

## Cart Communication

The shared Zustand store owns cart items and actions. Cart data is stored under the `microfrontend_cart` key as `{ id, name, price, quantity }` objects, preserving the original storage format. Store writes dispatch a `cart:updated` `CustomEvent`; the sync hook also listens for this event and the native `storage` event so independent store instances and same-origin tabs stay synchronized. Browser storage belongs to an origin, so standalone remote pages each use their own storage; the federated components loaded inside the host share the host origin and its cart.

## Features

- Dynamic Module Federation with independent Products and Cart apps
- Shared Zustand cart state with browser storage persistence
- Six products with Indian currency formatting
- Add to cart, remove, quantity controls, and cart totals
- Persistent cart and live navbar count
- Responsive UI, loading states, empty state, and remote error boundary
