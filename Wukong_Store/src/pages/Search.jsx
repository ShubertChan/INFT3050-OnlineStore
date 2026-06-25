// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Search / results page. Filters products by keyword and category; a line at the top shows the data source (live database / sample data).

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { money } from "../data.js";
import { useCatalog } from "../store/CatalogContext.jsx";
import { useCart } from "../store/CartContext.jsx";
import { useLoginGate } from "../store/LoginGateContext.jsx";
import { useToast } from "../store/ToastContext.jsx";
import CustomerShell from "../components/CustomerShell.jsx";
import Cover from "../components/Cover.jsx";
import { useTitle } from "../useTitle.js";

// Map a category value (Book/Movie/Game/Deals) to the nav label to highlight
const NAV_LABEL = { Book: "Books", Movie: "Movies", Game: "Games", Deals: "Deals" };

// A single search-result card (view details / add to cart)
function ResultCard({ product }) {
  const navigate = useNavigate();
  const { add } = useCart();
  const { requireLogin } = useLoginGate();
  const showToast = useToast();
  return (
    <article className="result-card card">
      <Cover product={product} />
      <div className="result-info">
        <span className="pill">{product.type}</span>
        <h3>{product.title}</h3>
        <p>Curated for Wukong members</p>
        <strong>{money(product.price)}</strong>
        <div className="result-actions">
          <button className="btn" type="button" onClick={() => navigate(`/product?id=${product.id}`)}>View Details</button>
          <button className="btn primary" type="button" onClick={() => requireLogin(() => { add(product.id, 1); showToast("Added to cart"); })}>Add to Cart</button>
        </div>
      </div>
    </article>
  );
}

export default function Search() {
  useTitle("Search Results");
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const type = params.get("type");
  const term = query.trim().toLowerCase();
  const { products, loading, fromDb, error } = useCatalog(); // products = items, fromDb = whether the data came from the database
  // Price filter (real): only show products whose price falls in the selected range.
  const [priceRange, setPriceRange] = useState("any");
  // Sort control (real): the select changes the order of the results.
  const [sortBy, setSortBy] = useState("relevance");
  const inPrice = (price) => {
    const v = Number(price) || 0;
    switch (priceRange) {
      case "u10": return v < 10;
      case "10-20": return v >= 10 && v <= 20;
      case "20-30": return v > 20 && v <= 30;
      case "o30": return v > 30;
      default: return true; // "any" -> no price filtering
    }
  };
  // Filter by category (type), search term, and the selected price range.
  const filteredItems = products.filter(
    (product) => (!type || product.type === type) && (!term || product.title.toLowerCase().includes(term)) && inPrice(product.price)
  );

  const dateValue = (value) => {
    const t = Date.parse(value || "");
    return Number.isNaN(t) ? 0 : t;
  };
  const items = [...filteredItems].sort((a, b) => {
    if (sortBy === "price-asc") return (Number(a.price) || 0) - (Number(b.price) || 0);
    if (sortBy === "price-desc") return (Number(b.price) || 0) - (Number(a.price) || 0);
    if (sortBy === "title-asc") return String(a.title || "").localeCompare(String(b.title || ""));
    if (sortBy === "title-desc") return String(b.title || "").localeCompare(String(a.title || ""));
    return 0; // "relevance" / default = keep the database/search order (no sorting)
  });

  // Pagination: show a fixed number of items per page with page controls.
  const PER_PAGE = 10;
  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); }, [type, term, priceRange, sortBy]); // reset to page 1 when filter/search/price/sort changes
  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageItems = items.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <CustomerShell active={type ? (NAV_LABEL[type] || "Home") : "Home"} searchValue={query}>
      <style>{css}</style>
      <div className="search-layout">
        <aside className="filters card">
          <h2>Filters</h2>
          <section>
            <h3>Price</h3>
            {[["any", "Any price"], ["u10", "Under $10"], ["10-20", "$10 - $20"], ["20-30", "$20 - $30"], ["o30", "Over $30"]].map(([val, label]) => (
              <label key={val}>
                <input type="radio" name="price" checked={priceRange === val} onChange={() => setPriceRange(val)} /> {label}
              </label>
            ))}
          </section>
        </aside>
        <section className="results">
          <div className="results-head">
            <h1>Search Results</h1>
            <select className="select" aria-label="Sort results" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="relevance">Default order</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="title-desc">Title: Z to A</option>
            </select>
          </div>
          <p style={{ margin: "0 0 14px", color: "var(--muted)", fontSize: 14 }}>
            {loading
              ? "Loading from database…"
              : fromDb
              ? `\u2713 Live data from the database (${products.length} items)`
              : "Showing sample data (database not connected)"}
          </p>
          {!loading && !fromDb && error && (
            <p style={{ margin: "0 0 14px", padding: "8px 11px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, color: "#b91c1c", fontSize: 12, wordBreak: "break-all" }}>
              <b>Connection error:</b> {error} — check the database docker is running (auth on :3001 + NocoDB on :8080).
            </p>
          )}
          {/* Debug output is now kept in the browser console only, not shown in the UI. */}
          <div className="results-grid">
            {items.length
              ? pageItems.map((product) => <ResultCard key={product.id} product={product} />)
              : <p className="no-results">No results found. Try a different search or category.</p>}
          </div>
          {totalPages > 1 && (
            <nav className="pager" aria-label="Pagination">
              <button className="btn" type="button" disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} type="button" className={`pager-num ${n === safePage ? "active" : ""}`} onClick={() => setPage(n)}>{n}</button>
              ))}
              <button className="btn" type="button" disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)}>Next</button>
            </nav>
          )}
        </section>
      </div>
    </CustomerShell>
  );
}

const css = `
.pager { display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 32px; }
.pager-num {
  min-width: 40px; min-height: 40px; padding: 0 10px;
  border: 1px solid #d1d5db; border-radius: 10px; background: #fff;
  font-weight: 700; cursor: pointer; transition: transform .15s ease, background-color .15s ease;
}
.pager-num:hover { transform: scale(1.06); color: var(--primary); }
.pager-num.active { background: var(--primary); border-color: var(--primary); color: #fff; }
.search-layout {
  display: grid;
  grid-template-columns: 245px 1fr;
  gap: 28px;
}
.filters {
  align-self: start;
  min-height: 560px;
  padding: 24px;
}
.filters h2 {
  margin: 0 0 22px;
  font-size: 25px;
}
.filters section { margin-bottom: 26px; }
.filters h3 {
  margin: 0 0 10px;
  font-size: 16px;
}
.filters label {
  display: block;
  margin: 10px 0;
  color: #4b5563;
  font-size: 17px;
}
.results-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}
.results-head h1 {
  margin: 0;
  color: var(--primary);
  font-size: 31px;
}
.results-head .select {
  width: 178px;
  min-height: 42px;
  border-radius: 999px;
}
.results-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 26px;
}
.result-card {
  display: flex;
  gap: 18px;
  min-height: 238px;
  padding: 40px 18px;
}
.result-info {
  min-width: 0;
  flex: 1;
}
.result-info h3 {
  margin: 4px 0;
  font-size: 24px;
  line-height: 1.1;
}
.result-info p {
  margin: 0 0 8px;
  color: var(--muted);
}
.result-info strong {
  display: block;
  margin-bottom: 16px;
  color: var(--primary);
  font-size: 25px;
}
.result-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.no-results {
  grid-column: 1 / -1;
  padding: 48px 24px;
  text-align: center;
  color: var(--muted);
  font-size: 18px;
}
@media (max-width: 980px) {
  .search-layout { grid-template-columns: 1fr; }
  .filters { min-height: auto; }
  .results-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .results-head { align-items: stretch; flex-direction: column; }
  .results-head .select { width: 100%; }
  .result-card { flex-direction: column; }
}
`;
