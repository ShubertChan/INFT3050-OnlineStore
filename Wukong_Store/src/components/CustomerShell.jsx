// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Customer page shell. Top: logo + search box + My Account / Cart + nav bar; bottom: Footer.
// Every customer page uses this shell, keeping the header and footer consistent.

import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext.jsx";
import { useCart } from "../store/CartContext.jsx";
import Logo from "./Logo.jsx";
import Footer from "./Footer.jsx";

// Top navigation items: [text, target]
const NAV_ITEMS = [
  ["Home", "/home"],
  ["Books", "/search?type=Book"],
  ["Movies", "/search?type=Movie"],
  ["Games", "/search?type=Game"],
  ["Deals", "/search?type=Deals"],
  ["Contact", "/contact"]
];

// props: active (which nav item to highlight), accountActive (whether to highlight the account button),
//        searchValue (default value of the search box), children (page content)
export default function CustomerShell({ active = "Home", accountActive = false, searchValue = "", children }) {
  const { user } = useAuth();   // Current user (decides whether the top-right shows the name or Log In)
  const { count } = useCart();  // Cart item count (shown on the Cart button)
  const navigate = useNavigate();

  // Submit search: prevent a page reload and navigate to the search page with the keyword
  const onSearch = (event) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("query");
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  };

  return (
    <div className="site-bg">
      <div className="app-frame">
        {/* Top bar: logo + search + account/cart */}
        <header className="topbar">
          <button className="logo" type="button" onClick={() => navigate("/home")}>
            <Logo size={40} />
            <span className="logo-name">Wukong</span>
          </button>
          <form className="search-form" onSubmit={onSearch}>
            <input key={searchValue} className="search-input" name="query" defaultValue={searchValue} placeholder="Search books, movies, games, and more..." />
          </form>
          <div></div>
          <div className="top-actions">
            {/* Signed in: show the user name (go to account); signed out: show Log In (go to the login chooser) */}
            {user ? (
              <button className={`account-link ${accountActive ? "active" : ""}`} type="button" onClick={() => navigate("/account")}>{user.name}</button>
            ) : (
              <button className="account-link" type="button" onClick={() => navigate("/login-select")}>Log In</button>
            )}
            <button className="cart-link" type="button" onClick={() => navigate("/cart")}>Cart({count})</button>
          </div>
        </header>
        {/* Primary navigation bar */}
        <nav className="nav" aria-label="Primary">
          {NAV_ITEMS.map(([label, to]) => (
            <button key={label} className={active === label ? "active" : ""} type="button" onClick={() => navigate(to)}>{label}</button>
          ))}
        </nav>
        <main className="page-body">{children}</main>{/* Each page's content goes here */}
        <Footer />
      </div>
    </div>
  );
}
