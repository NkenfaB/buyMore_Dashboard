# BuyMore catalog dashboard

React dashboard for managing the products and categories served by `buyMore_Backend`. The primary app now opens the catalog, replacing the unrelated event-workspace entry point; older screens remain in source and `src/LegacyEventApp.js` for reference.

```sh
npm ci --legacy-peer-deps
cp .env.example .env
npm start
```

Start the backend with MongoDB first. Configure REACT_APP_API_URL before building; the default is http://localhost:5000/api. The example uses port 3001 so the storefront can use 3000. Set the backend CORS_ORIGINS accordingly. Enter its ADMIN_TOKEN in the dashboard to enable catalog writes. It remains in React memory, is not stored in browser storage, and must not be embedded in a public build. Use HTTPS for deployed API/dashboard traffic.

List/search, create, edit and delete products/categories. Form validation, loading, empty and error states are included. Category names are text fields on products; category renaming does not migrate product records. This is a single-admin catalog demo, not an order/payment or multi-user administration system.

Run `npm test -- --watchAll=false` and `npm run build`. Confirm a new dashboard item appears after reloading the storefront against the same database. Existing unrelated auth/events code is not part of this working catalog flow.
