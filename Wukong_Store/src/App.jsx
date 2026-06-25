// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Main app component. Uses HashRouter to define every page's route (URL -> page),
// and wraps the whole app with Context providers, outermost to innermost: Catalog / Auth / Cart / Toast.

import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { CatalogProvider } from "./store/CatalogContext.jsx";
import { AuthProvider } from "./store/AuthContext.jsx";
import { CartProvider } from "./store/CartContext.jsx";
import { ToastProvider } from "./store/ToastContext.jsx";
import { LoginGateProvider } from "./store/LoginGateContext.jsx";

// Import all the page components (one file per page)
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Payment from "./pages/Payment.jsx";
import LoginSelect from "./pages/LoginSelect.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Forgot from "./pages/Forgot.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import Contact from "./pages/Contact.jsx";
import AccountOverview from "./pages/AccountOverview.jsx";
import Address from "./pages/Address.jsx";
import Password from "./pages/Password.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";

export default function App() {
  return (
    // Provider nesting order matters: CatalogProvider is outermost,
    // because CartProvider needs the catalog to look up each item's details.
    <CatalogProvider>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            {/* HashRouter: routes off the part after # in the URL (easy to deploy, no 404 on refresh) */}
            <HashRouter>
              <LoginGateProvider>
            <Routes>
              {/* Opening the site redirects to home */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              {/* ===== Customer pages ===== */}
              <Route path="/home" element={<Home />} />
              <Route path="/search" element={<Search />} />{/* Search / results page */}
              <Route path="/product" element={<ProductDetail />} />{/* Product detail, URL carries ?id= */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/payment" element={<Payment />} />
              {/* ===== Login / Register ===== */}
              <Route path="/login-select" element={<LoginSelect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot" element={<Forgot />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/contact" element={<Contact />} />
              {/* ===== Account centre ===== */}
              <Route path="/account" element={<AccountOverview />} />
              <Route path="/address" element={<Address />} />
              <Route path="/password" element={<Password />} />
              {/* ===== Admin back office ===== */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              {/* Any other URL falls back to home */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
              </LoginGateProvider>
          </HashRouter>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </CatalogProvider>
  );
}
