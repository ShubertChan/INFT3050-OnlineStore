import { useNavigate } from "react-router-dom";
import { products, money } from "../data.js";
import { useCart } from "../store/CartContext.jsx";
import { useToast } from "../store/ToastContext.jsx";
import CustomerShell from "../components/CustomerShell.jsx";
import Cover from "../components/Cover.jsx";
import { useTitle } from "../useTitle.js";

function Recommendation({ product }) {
  return (
    <article className="recommend-card card">
      <Cover product={product} />
      <div>
        <span className="pill">{product.type}</span>
        <h3>{product.title}</h3>
        <p>Curated for Wukong members</p>
        <strong>{money(product.price)}</strong>
      </div>
    </article>
  );
}

export default function Cart() {
  useTitle("Shopping Cart");
  const navigate = useNavigate();
  const { items, summary, updateQty, remove } = useCart();
  const showToast = useToast();

  return (
    <CustomerShell active="Home" accountActive={true}>
      <style>{css}</style>
      <section className="cart-page">
        <h1>Your Cart</h1>
        <div className="cart-grid">
          <div className="cart-left">
            <div className="cart-list">
              {items.map((line) => (
                <article className="cart-item card" key={line.product.id}>
                  <Cover product={line.product} size="tiny" />
                  <div>
                    <h2>{line.product.title}</h2>
                    <p>{line.product.type} · {line.product.shipping}</p>
                  </div>
                  <strong>{money(line.product.price)}</strong>
                  <div className="cart-controls">
                    <div className="quantity">
                      <button type="button" onClick={() => updateQty(line.product.id, line.qty - 1)}>-</button>
                      <output>{line.qty}</output>
                      <button type="button" onClick={() => updateQty(line.product.id, line.qty + 1)}>+</button>
                    </div>
                    <button className="btn link" type="button" onClick={() => { remove(line.product.id); showToast("Item removed"); }}>Remove</button>
                  </div>
                </article>
              ))}
              {items.length === 0 && <p className="cart-empty">Your cart is empty.</p>}
            </div>
            <button className="btn full" type="button" onClick={() => navigate("/search")}>Continue Shopping</button>
            <h2 className="like-title">You may also like</h2>
            <div className="recommend-grid">
              <Recommendation product={products[2]} />
              <Recommendation product={products[3]} />
            </div>
          </div>
          <aside className="summary card">
            <h2>Order Summary</h2>
            <dl>
              <div><dt>Subtotal</dt><dd>{money(summary.subtotal)}</dd></div>
              <div><dt>Shipping</dt><dd>{money(summary.shipping)}</dd></div>
              <div><dt>Tax</dt><dd>{money(summary.tax)}</dd></div>
              <div className="total"><dt>Total</dt><dd>{money(summary.total)}</dd></div>
            </dl>
            <button className="btn primary full" type="button" onClick={() => navigate("/payment")}>Proceed to checkout</button>
          </aside>
        </div>
      </section>
    </CustomerShell>
  );
}

const css = `
.cart-page h1 {
  margin: 0 0 22px;
  font-size: 32px;
}
.cart-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 28px;
  align-items: start;
}
.cart-list { display: grid; gap: 18px; }
.cart-item {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 20px;
  align-items: center;
  padding: 18px 22px;
}
.cart-item h2 {
  margin: 0 0 6px;
  font-size: 20px;
}
.cart-item p { margin: 0; color: var(--muted); }
.cart-item strong { color: var(--primary); font-size: 20px; }
.cart-controls {
  display: grid;
  justify-items: center;
  gap: 10px;
}
.cart-empty {
  padding: 26px;
  text-align: center;
  color: var(--muted);
}
.cart-left .btn.full { margin-top: 18px; }
.like-title {
  margin: 30px 0 16px;
  font-size: 24px;
}
.recommend-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.recommend-card {
  display: flex;
  gap: 16px;
  padding: 16px 18px;
}
.recommend-card h3 { margin: 4px 0; font-size: 18px; }
.recommend-card p { margin: 0 0 6px; color: var(--muted); font-size: 14px; }
.recommend-card strong { color: var(--primary); }
.summary {
  align-self: start;
  padding: 24px 26px;
}
.summary h2 { margin: 0 0 18px; font-size: 22px; }
.summary dl { margin: 0 0 20px; }
.summary dl > div {
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  color: #4b5563;
}
.summary dl .total {
  padding-top: 14px;
  border-top: 1px solid var(--line);
  color: var(--navy);
  font-weight: 800;
  font-size: 18px;
}
@media (max-width: 980px) {
  .cart-grid { grid-template-columns: 1fr; }
  .cart-item { grid-template-columns: auto 1fr; }
  .recommend-grid { grid-template-columns: 1fr; }
}
`;
