import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext.jsx";
import { CartProvider } from "./store/CartContext.jsx";
import { ToastProvider } from "./store/ToastContext.jsx";

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
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/product" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/login-select" element={<LoginSelect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot" element={<Forgot />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/account" element={<AccountOverview />} />
              <Route path="/address" element={<Address />} />
              <Route path="/password" element={<Password />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </HashRouter>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
