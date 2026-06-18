import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProduct, money } from "../data.js";
import { useCart } from "../store/CartContext.jsx";
import { useToast } from "../store/ToastContext.jsx";
import CustomerShell from "../components/CustomerShell.jsx";
import Cover from "../components/Cover.jsx";
import { useTitle } from "../useTitle.js";

const NAV_LABEL = { Book: "Books", Movie: "Movies", Game: "Games", Deals: "Deals" };

export default function ProductDetail() {
  useTitle("Product Detail");
  const [params] = useSearchParams();
  const product = getProduct(params.get("id") || "archive");
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();
  const { add } = useCart();
  const showToast = useToast();

  const addToCart = () => { add(product.id, qty); showToast("Added to cart"); };
  const buyNow = () => { add(product.id, qty); navigate("/payment"); };

  return (
    <CustomerShell active={NAV_LABEL[product.type] || "Home"}>
      <style>{css}</style>
      <section className="product-hero">
        <Cover product={product} size="large" />
        <article className="product-summary card">
          <span className="pill">{product.type}</span>
          <h1>{product.title}</h1>
          <div className="rating"><span>★★★★★</span> 4.8 / 5</div>
          <strong className="price">{money(product.price)}.00</strong>
          <p className="intro">A short introduction area for the product. It can show the main selling points, format, stock status, and delivery message.</p>
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
