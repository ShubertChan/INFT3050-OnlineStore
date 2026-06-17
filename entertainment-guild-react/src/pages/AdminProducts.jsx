import { useState } from "react";
import { products as seedProducts, money } from "../data.js";
import { useToast } from "../store/ToastContext.jsx";
import AdminShell from "../components/AdminShell.jsx";
import Cover from "../components/Cover.jsx";
import { useTitle } from "../useTitle.js";

export default function AdminProducts() {
  useTitle("Item Management");
  const showToast = useToast();
  const [rows, setRows] = useState(seedProducts);
  const [query, setQuery] = useState("");

  const visible = rows.filter((product) => product.title.toLowerCase().includes(query.toLowerCase()));
  const remove = (id) => {
    setRows((current) => current.filter((product) => product.id !== id));
    showToast("Item deleted from this demo table");
  };

  return (
    <AdminShell active="Item Management">
      <style>{css}</style>
      <div className="admin-page-head">
        <h1>Item Management</h1>
        <button className="btn primary" type="button" onClick={() => showToast("New item form opened")}>Add New Item</button>
      </div>
      <form className="search-form management-search" onSubmit={(event) => event.preventDefault()}>
        <input className="search-input" name="query" placeholder="Search items..." value={query} onChange={(event) => setQuery(event.target.value)} />
      </form>
      <section className="card table-card">
        <table className="data-table product-table">
          <thead><tr><th>Image</th><th>Item Name</th><th>Type</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
          <tbody>
            {visible.map((product) => (
              <tr key={product.id}>
                <td><Cover product={product} /></td>
                <td><strong>{product.title}</strong></td>
                <td>{product.type}</td>
                <td>{money(product.price)}</td>
                <td>{product.stock}</td>
                <td>
                  <button className="table-action edit" type="button" onClick={() => showToast("Edit mode")}>edit</button>
                  <button className="table-action delete" type="button" onClick={() => remove(product.id)}>delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <div className="management-foot">
        <p>Showing 1 to {visible.length} of 24 items</p>
        <div className="pager">
          <button onClick={() => showToast("Page changed")}>-</button>
          <button className="active">1</button>
          <button onClick={() => showToast("Page changed")}>2</button>
          <button onClick={() => showToast("Page changed")}>...</button>
          <button onClick={() => showToast("Page changed")}>+</button>
        </div>
      </div>
    </AdminShell>
  );
}

const css = `
.admin-page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}
.admin-page-head h1 { margin: 0; font-size: 28px; color: var(--navy); }
.management-search { width: 100%; margin-bottom: 20px; }
.table-card { padding: 8px 4px; overflow-x: auto; }
.product-table .cover {
  width: 56px;
  height: 74px;
  border-radius: 10px;
}
.product-table .cover .cover-letter { font-size: 22px; }
.product-table .cover .cover-type { font-size: 11px; }
.management-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 18px;
  color: var(--muted);
}
@media (max-width: 640px) {
  .admin-page-head { align-items: stretch; flex-direction: column; }
}
`;
