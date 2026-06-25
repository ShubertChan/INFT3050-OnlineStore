// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Product detail page. Shows a single product (cover, price, quantity stepper, add to cart); gets the product from the Catalog by the URL id.

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { money } from "../data.js";
import { useCatalog } from "../store/CatalogContext.jsx";
import { useCart } from "../store/CartContext.jsx";
import { useLoginGate } from "../store/LoginGateContext.jsx";
import { useToast } from "../store/ToastContext.jsx";
import CustomerShell from "../components/CustomerShell.jsx";
import Cover from "../components/Cover.jsx";
import { useTitle } from "../useTitle.js";

// Map a category value to the nav label to highlight
const NAV_LABEL = { Book: "Books", Movie: "Movies", Game: "Games", Deals: "Deals" };

export default function ProductDetail() {
  useTitle("Product Detail");
  const [params] = useSearchParams();
  const { getById } = useCatalog();
  const product = getById(params.get("id") || "archive"); // Get this product from the catalog by the URL's ?id=
  const [qty, setQty] = useState(1); // Quantity to buy
  const navigate = useNavigate();
  const { add } = useCart();
  const { requireLogin } = useLoginGate();
  const showToast = useToast();

  // Add to cart / buy now (buy now jumps straight to the payment page)
  const addToCart = () => requireLogin(() => { add(product.id, qty); showToast("Added to cart"); });
  const buyNow = () => requireLogin(() => { add(product.id, qty); navigate("/payment"); });

  return (
    <CustomerShell active={NAV_LABEL[product.type] || "Home"}>
      <style>{css}</style>
      <section className="product-hero">
        <Cover product={product} size="large" />
        <article className="product-summary card">
          <span className="pill">{product.type}</span>
          {product.subGenre && <span className="pill sub">{product.subGenre}</span>}
          <h1>{product.title}</h1>
          <div className="rating"><span>★★★★★</span> 4.8 / 5</div>
          <strong className="price">{money(product.price)}</strong>
          <p className="intro">A short introduction area for the product. It can show the main selling points, format, stock status, and delivery message.</p>
          {/* Extra info now pulled from the database: sub-category, publish date, source */}
          <ul className="product-meta">
            {product.subGenre && <li><b>Category</b><span>{product.type} / {product.subGenre}</span></li>}
            {product.published && <li><b>Published</b><span>{product.published}</span></li>}
            {product.sourceName && (
              <li><b>Source</b><span>{product.sourceLink
                ? <a href={product.sourceLink} target="_blank" rel="noreferrer">{product.sourceName}</a>
                : product.sourceName}</span></li>
            )}
          </ul>
          <div className="qty-row">
            <b>Quantity</b>
            <div className="quantity">
              <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))}>-</button>
              <output>{qty}</output>
              <button type="button" onClick={() => setQty((value) => value + 1)}>+</button>
            </div>
          </div>
          <div className="buy-actions">
            <button className="btn primary" type="button" onClick={addToCart}>Add to Cart</button>
            <button className="btn green" type="button" onClick={buyNow}>Buy Now</button>
          </div>
        </article>
      </section>
      <section className="detail-grid">
        <article className="card detail-card">
          <h2>Product Details</h2>
          <p>{product.details}</p>
        </article>
        <article className="card detail-card">
          <h2>About This Title</h2>
          <p>This area gives a longer description so users understand what they are buying before checkout.</p>
        </article>
      </section>
    </CustomerShell>
  );
}

const css = `
.product-hero {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 42px;
  align-items: start;
}
.product-summary { padding: 28px 32px; }
.pill.sub { margin-left: 8px; background: #eef2ff; color: #3730a3; }
.product-meta { list-style: none; margin: 0 0 22px; padding: 14px 16px; display: grid; gap: 8px; background: #f8fafc; border-radius: 12px; }
.product-meta li { display: flex; justify-content: space-between; gap: 16px; font-size: 14px; }
.product-meta li b { color: var(--navy); }
.product-meta li span { color: #4b5563; text-align: right; }
.product-meta a { color: var(--primary); font-weight: 700; }
.product-summary h1 {
  margin: 14px 0 10px;
  font-size: 34px;
  line-height: 1.1;
}
.rating {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-weight: 700;
}
.rating span { color: var(--gold); letter-spacing: 2px; }
.price {
  display: block;
  margin: 18px 0;
  color: var(--primary);
  font-size: 32px;
}
.intro {
  margin: 0 0 22px;
  color: #4b5563;
  line-height: 1.6;
}
.qty-row {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 22px;
}
.buy-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 26px;
  margin-top: 30px;
}
.detail-card { padding: 26px 30px; }
.detail-card h2 {
  margin: 0 0 12px;
  font-size: 22px;
}
.detail-card p {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
}
@media (max-width: 980px) {
  .product-hero { grid-template-columns: 1fr; }
  .detail-grid { grid-template-columns: 1fr; }
}
`;
