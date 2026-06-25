# API Integration Layer — STATUS: IN PROGRESS

**Author:** Zhang Lei · **Checkpoint:** Progress SCRUM 1 (Week 6)

This folder is the **data / API layer** that connects the frontend to the project
database. It follows the **Week 6 lab method**: the frontend talks **directly to
NocoDB's auto-generated REST API** using `axios` with the `xc-token` header — there
is no custom backend server.

## How it connects (lab setup)

- The course database runs in Docker (NocoDB + MSSQL) and exposes its API at
  `http://localhost:3001`.
- `vite.config.js` proxies `/api` → `http://localhost:3001`, so every request goes to
  `/api/inft3050/<Table>`.
- Every request carries the header `xc-token: <course token>` (set once in `client.js`).
- List endpoints return rows wrapped as `{ "list": [ ... ] }` (handled by `unwrapList`).

## Files

| File | Responsibility |
| --- | --- |
| `client.js` | Shared axios instance (base URL + token) and the `unwrapList` helper. |
| `products.js` | Product read / search / create / update / delete. Merges `Product` + `Stocktake` for price & stock. |
| `auth.js` | User register and login against the user table. |
| `orders.js` | List orders, query by status, and create an order with its line items. |
| `index.js` | Re-exports everything for a single import point. |

## Endpoints used

| Operation | Function | HTTP | NocoDB endpoint |
| --- | --- | --- | --- |
| List products | `getProducts()` | GET | `/Product`, `/Stocktake` |
| Get product | `getProduct(id)` | GET | `/Product/{id}` |
| Search products | `searchProducts(term)` | GET | `/Product` (filtered) |
| Add product | `createProduct(data)` | POST | `/Product` |
| Edit product | `updateProduct(id, data)` | PATCH | `/Product/{id}` |
| Delete product | `deleteProduct(id)` | DELETE | `/Product/{id}` |
| Register | `register({name,email,password})` | POST | `/User` |
| Login | `login(email, password)` | GET | `/User` (by email) |
| List orders | `getOrders()` | GET | `/Orders` |
| Get order | `getOrder(id)` | GET | `/Orders/{id}` |
| Orders by status | `getOrdersByStatus(status)` | GET | `/Orders` (filtered) |
| Create order | `createOrder({...})` | POST | `/Orders`, `/ProductsInOrders` |

## How the frontend uses it

```js
import { getProducts, getProduct, searchProducts,
         login, register, createOrder } from "./services";

const products = await getProducts();          // home / search pages
const item     = await getProduct("1");         // product detail page
const result   = await login(email, password);  // login page
await createOrder({ customerId, items });        // checkout
```

For example, the product catalog can read from here:
```js
// src/store/CatalogContext.jsx
import { getProducts } from "../services";
// ...load products from getProducts(), fall back to sample data if it fails.
```

## To verify before the demo (use Postman, as in the lab)

1. **Token** — confirm the `xc-token` in `client.js` matches your team's NocoDB token.
2. **Table names** — confirm `Product`, `Stocktake`, `User`, `Orders`, `ProductsInOrders`
   (the lab demo used `Books`; live names may differ).
3. **Column names** — confirm the field names used in the mappers (Name, Genre, Price,
   Quantity, ProductId, Email, HashedPW, Status, etc.).
4. **Filter syntax** — confirm the `?where=(field,op,value)` format on your NocoDB version
   (the code falls back to client-side filtering if it differs).

## Notes & follow-ups

- Passwords are hashed with **SHA-256 over (salt + password)** to match the schema's
  `Salt` + `HashedPW` columns. Accounts created through the app log in correctly;
  pre-existing DB accounts created with a different scheme would need that scheme
  (login also accepts a legacy plain-text match for convenience).
- Product price/stock writes to `Stocktake` are best-effort: if `Stocktake` requires
  extra columns (e.g. `SourceId`) adjust `createProduct` / `updateProduct`.
- **Ban feature** needs two extra columns on the user table: **`Status`** (text, e.g.
  "Active" / "Suspended") and **`BannedUntil`** (datetime, nullable). Add them in
  NocoDB (table → add column), or via SQL then refresh the schema:
  `ALTER TABLE [User] ADD Status NVARCHAR(20) NULL; ALTER TABLE [User] ADD BannedUntil DATETIME NULL;`
  Without these columns, ban/unban still works but falls back to local-only.
- Order creation assumes simple `Orders` + `ProductsInOrders` columns; adjust to the
  final schema.
- Every page that uses these functions **falls back to demo/local behaviour when the
  database is offline**, so the prototype always runs (DB on = real, DB off = demo).
