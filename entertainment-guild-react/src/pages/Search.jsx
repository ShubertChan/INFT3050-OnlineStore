import { useNavigate, useSearchParams } from "react-router-dom";
import { searchProducts, money } from "../data.js";
import { useCart } from "../store/CartContext.jsx";
import { useToast } from "../store/ToastContext.jsx";
import CustomerShell from "../components/CustomerShell.jsx";
import Cover from "../components/Cover.jsx";
import { useTitle } from "../useTitle.js";

const NAV_LABEL = { Book: "Books", Movie: "Movies", Game: "Games", Deals: "Deals" };

function ResultCard({ product }) {
  const navigate = useNavigate();
  const { add } = useCart();
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
          <button className="btn primary" type="button" onClick={() => { add(product.id, 1); showToast("Added to cart"); }}>Add to Cart</button>
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
  const items = searchProducts.filter(
    (product) => (!type || product.type === type) && (!term || product.title.toLowerCase().includes(term))
  );

  return (
    <CustomerShell active={type ? (NAV_LABEL[type] || "Home") : "Home"} searchValue={query}>
      <style>{css}</style>
      <div className="search-layout">
        <aside className="filters card">
          <h2>Filters</h2>
          <section>
            <h3>Category</h3>
            {["Books", "Movies", "Games", "Deals"].map((label) => (
              <label key={label}><input type="checkbox" defaultChecked={Boolean(type && label.startsWith(type))} /> {label}</label>
            ))}
          </section>
          <section>
            <h3>Price</h3>
            <label><input type="radio" name="price" /> Under $10</label>
            <label><input type="radio" name="price" defaultChecked /> $10 - $20</label>
            <label><input type="radio" name="price" /> $20 - $30</label>
            <label><input type="radio" name="price" /> Over $30</label>
          </section>
        </aside>
        <section className="results">
          <div className="results-head">
            <h1>Search Results</h1>
            <select className="select" aria-label="Sort results">
              <option>Sort by relevance</option>
              <option>Price low to high</option>
              <option>Newest first</option>
            </select>
          </div>
          <div className="results-grid">
            {items.length
              ? items.map((product) => <ResultCard key={product.id} product={product} />)
              : <p className="no-results">No results found. Try a different search or category.</p>}
          </div>
        </section>
      </div>
    </CustomerShell>
  );
}

const css = `
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
