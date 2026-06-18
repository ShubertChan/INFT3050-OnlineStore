import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext.jsx";
import { useCart } from "../store/CartContext.jsx";
import Logo from "./Logo.jsx";
import Footer from "./Footer.jsx";

const NAV_ITEMS = [
  ["Home", "/home"],
  ["Books", "/search?type=Book"],
  ["Movies", "/search?type=Movie"],
  ["Games", "/search?type=Game"],
  ["Deals", "/search?type=Deals"],
  ["Contact", "/contact"]
];

export default function CustomerShell({ active = "Home", accountActive = false, searchValue = "", children }) {
  const { user } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const onSearch = (event) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("query");
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  };

  return (
    <div className="site-bg">
      <div className="app-frame">
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
            {user ? (
              <button className={`account-link ${accountActive ? "active" : ""}`} type="button" onClick={() => navigate("/account")}>{user.name}</button>
            ) : (
              <button className="account-link" type="button" onClick={() => navigate("/login-select")}>Log In</button>
            )}
            <button className="cart-link" type="button" onClick={() => navigate("/cart")}>Cart({count})</button>
          </div>
        </header>
        <nav className="nav" aria-label="Primary">
          {NAV_ITEMS.map(([label, to]) => (
            <button key={label} className={active === label ? "active" : ""} type="button" onClick={() => navigate(to)}>{label}</button>
          ))}
        </nav>
        <main className="page-body">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
