// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Admin dashboard home. Stat cards (items / orders / users), recent orders, low-stock items, etc. (numbers are placeholder sample data).

import { orders } from "../data.js";
import { useToast } from "../store/ToastContext.jsx";
import AdminShell from "../components/AdminShell.jsx";
import { useTitle } from "../useTitle.js";

// Placeholder data for the top stat cards: [label, value, link text]
const STATS = [
  ["Total Items", "248", "View all items"],
  ["Total Users", "1,206", "View all users"],
  ["Total Orders", "532", "View all orders"],
  ["Total Reports", "18", "View reports"]
];
// Placeholder data for the low-stock bars: [name, percent width, colour]
const LOW_STOCK = [
  ["Item 1", 92, "#fca5a5"],
  ["Item 2", 86, "#f6b81a"],
  ["Item 3", 90, "#fca5a5"]
];

export default function AdminDashboard() {
  useTitle("Admin Dashboard");
  const showToast = useToast();

  return (
    <AdminShell active="Dashboard">
      <style>{css}</style>
      <h1 className="admin-title">Admin Dashboard</h1>
      <section className="stat-grid">
        {STATS.map(([label, value, link]) => (
          <article className="card stat-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <button className="btn link" type="button" onClick={() => showToast(link)}>{link}</button>
          </article>
        ))}
      </section>
      <section className="dashboard-grid">
        <article className="card recent-orders">
          <div className="panel-head">
            <h2>Recent Orders</h2>
            <button className="btn link" type="button" onClick={() => showToast("All orders")}>View all orders</button>
          </div>
          <table className="data-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {/* Recent orders (sample data from data.js) */}
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>{order.items}</td>
                  <td>${order.total}</td>
                  <td><span className={`status ${order.status === "Processing" ? "warn" : "good"}`}>{order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pager">
            <button onClick={() => showToast("Page changed")}>-</button>
            <button className="active">1</button>
            <button onClick={() => showToast("Page changed")}>+</button>
          </div>
        </article>
        <article className="card low-stock">
          <div className="panel-head">
            <h2>Low Stock</h2>
            <button className="btn link" type="button" onClick={() => showToast("Stock list")}>View all</button>
          </div>
          {LOW_STOCK.map(([label, width, color]) => (
            <div className="stock-item" key={label}>
              <b>{label}</b>
              <span><i style={{ width: `${width}%`, background: color }}></i></span>
            </div>
          ))}
          <p>Showing 1 to 3 of 3 items</p>
        </article>
      </section>
    </AdminShell>
  );
}

const css = `
.admin-title { margin: 0 0 24px; font-size: 28px; color: var(--navy); }
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 28px;
}
.stat-card {
  display: grid;
  gap: 8px;
  padding: 22px 24px;
}
.stat-card span { color: var(--muted); font-weight: 700; }
.stat-card strong { font-size: 30px; color: var(--navy); }
.dashboard-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 24px;
  align-items: start;
}
.recent-orders, .low-stock { padding: 22px 24px; }
.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.panel-head h2 { margin: 0; font-size: 22px; }
.stock-item {
  display: grid;
  grid-template-columns: 80px 1fr;
  align-items: center;
  gap: 14px;
  margin: 14px 0;
}
.stock-item span {
  display: block;
  height: 10px;
  border-radius: 999px;
  background: #f1ece4;
  overflow: hidden;
}
.stock-item i { display: block; height: 100%; }
.low-stock p { margin: 16px 0 0; color: var(--muted); font-size: 14px; }
@media (max-width: 1100px) {
  .stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dashboard-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .stat-grid { grid-template-columns: 1fr; }
}
`;
