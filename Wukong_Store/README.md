# Wukong — Online Store (React + Vite)

Wukong (Entertainment Guild) is a React storefront and admin back office built for
the INFT3050 group project. It sells books, movies, games and deals. It can run as a
standalone front-end prototype, or connect to the course database through a REST API.

## Features

**Storefront**
- Home, category browsing (Books / Movies / Games / Deals), search, product detail,
  cart and a checkout / payment flow.
- Customer accounts: register, login, account overview, address book, change password,
  and a contact form.

**Database / API layer** (`src/services`)
- Connects to the course NocoDB REST API (`/api/inft3050/<table>`, axios + `xc-token`).
- Products are read from the `Product` table and merged with price/stock from `Stocktake`.
- Registration and login use SHA-256 + salt password hashing (`HashedPW` / `Salt`).
- Checkout creates an order (`Orders` + `ProductsInOrders`).
- Every database call has an **offline fallback**: when the database is not running the
  app uses local / sample data, so it always works.

**Admin back office**
- Item Management: add / edit / delete products through forms (writes to the database).
- User Management with **role-based permissions**:
  - A **regular admin** can only ban / unban customer accounts.
  - A **super admin** can additionally add, edit, change the password of, ban and
    delete administrator accounts.
- **Timed bans**: choose a ban length (1 day up to 10 years, or permanent); the status
  and expiry are saved to the database.

## Tech stack
- **React 18** — component-based UI (every page and layout is a component)
- **Vite** — dev server + production build
- **react-router-dom** — routing (HashRouter; URLs look like `#/home`)
- **React Context** — global state (auth, cart, catalog, toast)

## Running the app

You need Node.js (version 18 or newer).

### 1. Front-end only — works without a database (demo mode)
```bash
npm install      # first time only, installs dependencies
npm run dev      # starts the dev server, usually at http://localhost:5173
```
In demo mode the site uses sample data, and registration / login / admin actions update
a local table only.

### 2. With the database (real data)
Start the course database (per the Week 6 lab), for example with Docker / NocoDB on
`http://localhost:3001`, then run `npm run dev` again. Vite proxies `/api` to the
database, so the same code now reads and writes real data.

### Build for deployment
```bash
npm run build    # output goes to dist/
npm run preview  # preview the production build locally
```

## Database notes
The API layer expects these tables: `Product`, `Stocktake`, `User`, `Orders`,
`ProductsInOrders` (verify the exact names in NocoDB / Postman).

For the **timed-ban feature**, the `User` table needs two extra columns:
- `Status` — text (e.g. "Active" / "Suspended")
- `BannedUntil` — datetime, nullable (when a timed ban ends; empty = none / permanent)

Without these columns, ban / unban still works but falls back to local only.

## Test accounts
- **Super admin** (full admin management): `superadmin@example.com`
- **Regular admin** (ban customers only): `admin@example.com`
- **Customer**: register a new account, or in demo mode any email signs in.

To reach the admin sign-in: top-right **Log In** → choose **Administrator**.

## Project structure
```
src/
├── main.jsx               entry point
├── App.jsx                route table (every page is registered here)
├── index.css             global styles
├── data.js               sample products / orders / users + helpers
├── useTitle.js            small hook to set the page title
├── services/             API / data layer (database access)
│   ├── client.js            shared axios instance (base URL + token)
│   ├── products.js          products (Product + Stocktake): read / search / CRUD
│   ├── auth.js              register / login (hashed) + admin user CRUD
│   ├── orders.js            orders (Orders + ProductsInOrders)
│   ├── index.js             re-exports
│   └── README.md            API endpoint notes
├── store/                global state
│   ├── AuthContext.jsx      login state (useAuth)
│   ├── CartContext.jsx      cart (useCart)
│   ├── CatalogContext.jsx   products (loaded from the API, with fallback)
│   ├── ToastContext.jsx     toast messages (useToast)
│   └── feedback.js          contact-form storage
├── components/           reusable layout components
│   ├── CustomerShell.jsx    customer shell (top bar + nav)
│   ├── AdminShell.jsx       admin shell (sidebar)
│   ├── AccountMenu.jsx      account-centre side menu
│   ├── Cover.jsx            product cover tile
│   ├── Footer.jsx           footer
│   └── Logo.jsx             Wukong logo
└── pages/                pages, one per route
    ├── Home / Search / ProductDetail / Cart / Payment / Contact
    ├── LoginSelect / Login / Register / Forgot / AdminLogin
    ├── AccountOverview / Address / Password
    └── AdminDashboard / AdminProducts / AdminUsers
```

## Status
This is a group project for INFT3050 and is still in progress. Database integration is
wired with an offline fallback. Some areas are not yet connected to the database and
currently use local / sample data — notably the contact-form feedback storage and the
customer order-history view.
