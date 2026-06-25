// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Checkout / payment page. Top step bar + payment form (card number / expiry / CVV, etc.) + order summary on the right. Demo only.

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { money } from "../data.js";
import { createOrder } from "../services/index.js";
import { useCart } from "../store/CartContext.jsx";
import { useAuth } from "../store/AuthContext.jsx";
import { useToast } from "../store/ToastContext.jsx";
import CustomerShell from "../components/CustomerShell.jsx";
import Cover from "../components/Cover.jsx";
import { useTitle } from "../useTitle.js";

// Available payment methods
const METHODS = ["Visa", "PayPal", "PayNow"];

export default function Payment() {
  useTitle("Payment");
  const navigate = useNavigate();
  const { items, summary, clear } = useCart();
  const { user } = useAuth();
  const showToast = useToast();
  const [method, setMethod] = useState("Visa"); // Currently selected payment method
  const formRef = useRef(null);
  // Guard: cannot pay with an empty cart -> tell the user and go back to the cart.
  useEffect(() => {
    if (items.length === 0) {
      showToast("Your cart is empty");
      const t = setTimeout(() => navigate("/cart"), 50);
      return () => clearTimeout(t);
    }
  }, []); // check once on entry; do not re-trigger after checkout clears the cart
                 // read all fields on confirm

  // Click "Review Order": just a toast (demo)
  const onSubmit = (event) => { event.preventDefault(); showToast("Order ready for review"); };
  // Confirm payment: create the order in the database, then clear the cart and go to
  // the account page. Falls back to demo (no real order) if the database is offline.
  const onConfirm = async () => {
    const fd = new FormData(formRef.current);
    const address = {
      street: fd.get("street") || "", suburb: fd.get("suburb") || "",
      state: fd.get("state") || "", postcode: fd.get("postcode") || "",
    };
    const card = {
      owner: fd.get("name") || "", number: fd.get("card") || "",
      expiry: fd.get("expiry") || "", cvv: fd.get("cvv") || "",
      email: user?.email || "", phone: fd.get("phone") || "",
    };
    try {
      await createOrder({
        customer: user?.id ?? user?.email ?? "guest", // Orders.Customer (Patrons key)
        address,                                       // -> Orders address fields
        items: items.map((line) => ({ id: line.id, qty: line.qty })), // -> ProductsInOrders
        card,                                          // -> TO (payment + delivery)
      });
      showToast("Order placed");
    } catch {
      showToast("Payment confirmed (offline demo)");
    }
    clear();
    setTimeout(() => navigate("/account"), 600);
  };

  return (
    <CustomerShell active="Home" accountActive={true}>
      <style>{css}</style>
      <section className="checkout-steps card">
        {["Cart", "Shipping", "Payment", "Review"].map((label, index) => (
          <div key={label} className={index === 2 ? "active" : ""}>
            <span>{index + 1}</span>
            <b>{label}</b>
          </div>
        ))}
      </section>
      <section className="checkout-grid">
        <form className="payment-form card" onSubmit={onSubmit} ref={formRef}>
          <h1>Payment Details</h1>
          <div className="field"><label>Name on Card</label><input className="input" name="name" placeholder="Enter name as it appears on card" required /></div>
          <div className="field"><label>Card Number</label><input className="input" name="card" inputMode="numeric" required /></div>
          <div className="two">
            <div className="field"><label>Expiry Date</label><input className="input" name="expiry" required /></div>
            <div className="field"><label>CVV</label><input className="input" name="cvv" inputMode="numeric" required /></div>
          </div>
          <h2>Shipping Address</h2>
          <div className="field"><label>Street Address</label><input className="input" name="street" required /></div>
          <div className="two">
            <div className="field"><label>Suburb / City</label><input className="input" name="suburb" required /></div>
            <div className="field"><label>State</label><input className="input" name="state" required /></div>
          </div>
          <div className="two">
            <div className="field"><label>Post Code</label><input className="input" name="postcode" inputMode="numeric" required /></div>
            <div className="field"><label>Phone</label><input className="input" name="phone" inputMode="tel" /></div>
          </div>
          <h2>Payment Method</h2>
          <div className="method-tabs" role="group" aria-label="Payment method">
            {METHODS.map((name) => (
              <button key={name} className={method === name ? "active" : ""} type="button" onClick={() => setMethod(name)}>{name}</button>
            ))}
          </div>
          <button className="btn primary full" type="submit">Review Order</button>
        </form>
        <aside className="order-summary card">
          <h2>Order Summary</h2>
          <div className="summary-lines">
            {items.map((line) => (
              <div className="summary-line" key={line.product.id}>
                <Cover product={line.product} size="tiny" />
                <div><h3>{line.product.title}</h3><p>Qty: {line.qty}</p></div>
                <strong>{money(line.total)}</strong>
              </div>
            ))}
            {items.length === 0 && <p className="cart-empty">No items in cart.</p>}
          </div>
          <dl>
            <div><dt>Subtotal: {summary.count} items</dt><dd>{money(summary.subtotal)}</dd></div>
            <div><dt>Shipping</dt><dd>{money(summary.shipping)}</dd></div>
            <div><dt>Tax</dt><dd>{money(summary.tax)}</dd></div>
            <div className="total"><dt>Total</dt><dd>{money(summary.total)}</dd></div>
          </dl>
          <div className="summary-actions">
            <button className="btn primary" type="button" onClick={onConfirm}>Confirm</button>
            <button className="btn" type="button" onClick={() => navigate("/cart")}>Cancel</button>
          </div>
        </aside>
      </section>
    </CustomerShell>
  );
}

const css = `
.checkout-steps {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 26px;
  margin-bottom: 24px;
}
.checkout-steps > div {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  font-weight: 800;
}
.checkout-steps span {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #eef1f6;
  color: #6b7280;
}
.checkout-steps .active { color: var(--primary); }
.checkout-steps .active span { background: var(--primary); color: #fff; }
.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 28px;
  align-items: start;
}
.payment-form {
  padding: 28px 32px;
  display: grid;
  gap: 16px;
}
.payment-form h1 { margin: 0; font-size: 28px; }
.payment-form h2 { margin: 8px 0 0; font-size: 20px; }
.two {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.method-tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.method-tabs button {
  min-height: 44px;
  padding: 0 22px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--paper);
  font-weight: 800;
}
.method-tabs button.active {
  border-color: var(--primary);
  background: #fff0ea;
  color: var(--primary);
}
.order-summary {
  align-self: start;
  padding: 24px 26px;
}
.order-summary h2 { margin: 0 0 18px; font-size: 22px; }
.summary-lines {
  display: grid;
  gap: 14px;
  margin-bottom: 18px;
}
.summary-line {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 14px;
  align-items: center;
}
.summary-line h3 { margin: 0; font-size: 16px; }
.summary-line p { margin: 4px 0 0; color: var(--muted); font-size: 14px; }
.summary-line strong { color: var(--primary); }
.order-summary dl { margin: 0 0 18px; }
.order-summary dl > div {
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  color: #4b5563;
}
.order-summary dl .total {
  padding-top: 14px;
  border-top: 1px solid var(--line);
  color: var(--navy);
  font-weight: 800;
  font-size: 18px;
}
.summary-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 980px) {
  .checkout-grid { grid-template-columns: 1fr; }
  .checkout-steps { flex-wrap: wrap; }
}
`;
