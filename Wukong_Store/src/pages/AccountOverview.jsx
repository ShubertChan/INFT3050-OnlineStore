// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Account overview page. Shows profile, default address, recent orders, etc. (the account-centre home).

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrdersByCustomer } from "../services/index.js";
import { useAuth } from "../store/AuthContext.jsx";
import CustomerShell from "../components/CustomerShell.jsx";
import AccountMenu from "../components/AccountMenu.jsx";
import { useTitle } from "../useTitle.js";

export default function AccountOverview() {
  useTitle("Account Overview");
  const { user } = useAuth();                       // Current user
  const name = user ? user.name : "Guest";          // Show Guest when signed out
  const email = user ? user.email : "Not signed in";
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  // Load this customer's own orders from the database (empty if offline / none yet).
  useEffect(() => {
    if (!user) return;
    getOrdersByCustomer(user.id ?? user.email)
      .then((rows) => setOrders(rows || []))
      .catch(() => { /* database offline -> keep empty */ });
  }, [user]);

  return (
    <CustomerShell active="Home" accountActive={true}>
      <style>{css}</style>
      <div className="account-layout">
        <AccountMenu active="Account Overview" />{/* Left account menu */}
        <section className="account-main">
          <h1 className="section-title">Account Overview</h1>
          {/* Profile + default address cards */}
          <div className="info-grid">
            <article className="card info-card">
              <h2>Profile Information</h2>
              <p>{name}<br />{email}<br />Personal details and email preferences.</p>
            </article>
            <article className="card info-card">
              <h2>Default Address</h2>
              <p>Singapore<br />Saved shipping address for faster checkout.</p>
            </article>
          </div>
          {/* Order history (sample data here) */}
          <article className="card order-card">
            <div className="order-head">
              <h2>Order History</h2>
              <button className="btn link" type="button" onClick={() => navigate("/account")}>View all orders</button>
            </div>
            <table className="data-table">
              <thead>
                <tr><th>Order ID</th><th>Ship To</th><th>Action</th></tr>
              </thead>
              <tbody>
                {orders.length ? orders.map((o) => (
                  <tr key={o.OrderID ?? o.ID ?? o.Id}>
                    <td>#{o.OrderID ?? o.ID ?? o.Id}</td>
                    <td>{[o.Suburb, o.State, o.PostCode].filter(Boolean).join(", ") || o.StreetAddress || "—"}</td>
                    <td><button className="btn" type="button" onClick={() => navigate("/account")}>View Order</button></td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} className="order-empty">{user ? "No orders yet." : "Sign in to see your orders."}</td></tr>
                )}
              </tbody>
            </table>
          </article>
        </section>
      </div>
    </CustomerShell>
  );
}

// Styles for this page
const css = `
.account-layout {
  display: grid;
  grid-template-columns: 230px 1fr;
  gap: 28px;
  align-items: start;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
  margin-bottom: 26px;
}
.info-card { padding: 24px 26px; }
.info-card h2 { margin: 0 0 12px; font-size: 20px; }
.info-card p { margin: 0; color: #4b5563; line-height: 1.7; }
.order-card { padding: 24px 26px; }
.order-empty { text-align: center; color: var(--muted); padding: 18px 0; }
.order-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.order-head h2 { margin: 0; font-size: 22px; }
@media (max-width: 980px) {
  .account-layout { grid-template-columns: 1fr; }
  .info-grid { grid-template-columns: 1fr; }
}
`;
