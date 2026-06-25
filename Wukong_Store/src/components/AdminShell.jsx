// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Admin page shell. Left sidebar menu (Dashboard / Item / User / Reports / Settings / Logout).
// Every admin back-office page uses this shell.

import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext.jsx";
import { useToast } from "../store/ToastContext.jsx";
import Logo from "./Logo.jsx";

// Sidebar menu items: [text, target]
const ITEMS = [
  ["Dashboard", "/admin"],
  ["Item Management", "/admin/products"],
  ["User Management", "/admin/users"],
  ["Orders", "/admin"],
  ["Reports", "/admin"],
  ["Settings", "/admin"]
];

// props: active (which menu item to highlight), children (page content)
export default function AdminShell({ active, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();

  // Logout: clear login state + toast + back to home
  const onLogout = () => {
    logout();
    showToast("Signed out");
    navigate("/home");
  };

  return (
    <div className="admin-bg">
      <div className="admin-frame">
        {/* Left sidebar */}
        <aside className="admin-side">
          <button className="admin-logo" type="button" onClick={() => navigate("/admin")}>
            <Logo size={40} />
            <span>Wukong</span>
          </button>
          <nav className="admin-menu" aria-label="Admin">
            {ITEMS.map(([label, to]) => (
              <button key={label} className={active === label ? "active" : ""} type="button" onClick={() => navigate(to)}>{label}</button>
            ))}
            <button type="button" onClick={onLogout}>Logout</button>
          </nav>
        </aside>
        {/* Right content area: top search bar + page content */}
        <main className="admin-content">
          <div className="admin-top">
            <form className="search-form" onSubmit={(event) => event.preventDefault()}>
              <input className="search-input" name="query" placeholder="Search books, movies, games, and more..." />
            </form>
            <div className="admin-account">{user ? user.name : "Admin Account"}</div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
