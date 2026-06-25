// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Site-wide footer. Brand info + Shop / Quick Links / contact columns + social icons.

import { useNavigate } from "react-router-dom";
import Logo from "./Logo.jsx";

// Links for the "Shop" column: [text, target] (each opens the search page with a category)
const SHOP = [
  ["Books", "/search?type=Book"],
  ["Movies", "/search?type=Movie"],
  ["Games", "/search?type=Game"],
  ["Deals", "/search?type=Deals"]
];

// Links for the "Quick Links" column
const LINKS = [
  ["Home", "/home"],
  ["Contact", "/contact"],
  ["My Account", "/account"],
  ["Cart", "/cart"]
];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Column 1: brand logo + tagline + social icons */}
        <div className="footer-brand">
          <span className="footer-logo"><Logo size={36} /> Wukong</span>
          <p className="footer-tagline">Books, movies, and games for every journey. Curated picks for Wukong members.</p>
          <div className="footer-social">
            {/* Three social buttons (inline SVG icons, demo only, not linked) */}
            <button type="button" aria-label="Email">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
            </button>
            <button type="button" aria-label="Messages">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z" /></svg>
            </button>
            <button type="button" aria-label="Website">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" /></svg>
            </button>
          </div>
        </div>

        {/* Column 2: Shop category links */}
        <div className="footer-col">
          <h3>Shop</h3>
          {SHOP.map(([label, to]) => (
            <button key={label} type="button" onClick={() => navigate(to)}>{label}</button>
          ))}
        </div>

        {/* Column 3: quick links */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          {LINKS.map(([label, to]) => (
            <button key={label} type="button" onClick={() => navigate(to)}>{label}</button>
          ))}
        </div>

        {/* Column 4: contact details */}
        <div className="footer-col footer-contact">
          <h3>Get in touch</h3>
          <p>Questions or feedback?</p>
          <a href="mailto:support@wukong.com">support@wukong.com</a>
          <p className="footer-hours">Mon–Fri, 9am–6pm</p>
        </div>
      </div>

      {/* Bottom copyright bar */}
      <div className="footer-bottom">
        <span>© 2026 Wukong. All rights reserved.</span>
        <span>Built with React</span>
      </div>
    </footer>
  );
}
