// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Item management page (admin). Product list + search + add / edit / delete.
// Reads the live product list and writes add/edit/delete through the API layer
// (src/services). If the database/API is offline it falls back to a local-only
// table so the prototype still works.

import { useState, useEffect } from "react";
import { products as seedProducts, money } from "../data.js";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/index.js";
import { useToast } from "../store/ToastContext.jsx";
import AdminShell from "../components/AdminShell.jsx";
import Cover from "../components/Cover.jsx";
import { useTitle } from "../useTitle.js";

const BLANK = { id: null, title: "", type: "Book", price: 0, stock: 0, description: "" };

export default function AdminProducts() {
  useTitle("Item Management");
  const showToast = useToast();
  const [rows, setRows] = useState(seedProducts); // sample data until the DB loads
  const [query, setQuery] = useState("");          // search keyword
  const [editing, setEditing] = useState(null);    // null = closed; object = add/edit form
  const [saving, setSaving] = useState(false);

  // Load the real product list from the database (keeps sample data if offline).
  useEffect(() => {
    let alive = true;
    getProducts()
      .then((list) => { if (alive && list && list.length) setRows(list); })
      .catch(() => { /* database offline -> keep sample data */ });
    return () => { alive = false; };
  }, []);

  const visible = rows.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));

  const openAdd = () => setEditing({ ...BLANK });
  const openEdit = (p) =>
    setEditing({ id: p.id, title: p.title, type: p.type, price: p.price, stock: p.stock, description: p.description || "" });
  const field = (key, value) => setEditing((e) => ({ ...e, [key]: value }));

  // Save (add or edit): write to the database; fall back to local-only if offline.
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    const form = {
      title: editing.title.trim() || "Untitled",
      type: editing.type,
      price: Number(editing.price) || 0,
      stock: Number(editing.stock) || 0,
      description: editing.description,
    };
    try {
      if (editing.id == null) {
        const created = await createProduct(form);        // INSERT into Product (+ Stocktake)
        setRows((r) => [created, ...r]);
        showToast("Item added to the database");
      } else {
        await updateProduct(editing.id, form);            // PATCH Product (+ Stocktake)
        setRows((r) => r.map((p) => (p.id === editing.id ? { ...p, ...form } : p)));
        showToast("Item updated in the database");
      }
    } catch {
      // database/API offline -> update only the local table
      if (editing.id == null) {
        const local = {
          ...form, id: "local-" + Date.now(),
          letter: (form.title[0] || "B").toUpperCase(), color: "#c9460b", homePrice: form.price,
        };
        setRows((r) => [local, ...r]);
        showToast("Item added (offline demo)");
      } else {
        setRows((r) => r.map((p) => (p.id === editing.id ? { ...p, ...form } : p)));
        showToast("Item updated (offline demo)");
      }
    } finally {
      setSaving(false);
      setEditing(null);
    }
  };

  // Delete: remove from the database; fall back to local-only if offline.
  const remove = async (id) => {
    try {
      await deleteProduct(id);                             // DELETE from Product
      showToast("Item deleted from the database");
    } catch {
      showToast("Item deleted (offline demo)");
    }
    setRows((current) => current.filter((p) => p.id !== id));
  };

  return (
    <AdminShell active="Item Management">
      <style>{css}</style>
      {/* Title + add button */}
      <div className="admin-page-head">
        <h1>Item Management</h1>
        <button className="btn primary" type="button" onClick={openAdd}>Add New Item</button>
      </div>
      {/* Search box (filters as you type) */}
      <form className="search-form management-search" onSubmit={(event) => event.preventDefault()}>
        <input className="search-input" name="query" placeholder="Search items..." value={query} onChange={(event) => setQuery(event.target.value)} />
      </form>
      {/* Products table */}
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
                  <button className="table-action edit" type="button" onClick={() => openEdit(product)}>edit</button>
                  <button className="table-action delete" type="button" onClick={() => remove(product.id)}>delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <div className="management-foot">
        <p>Showing 1 to {visible.length} of {rows.length} items</p>
      </div>

      {/* Add / Edit modal form */}
      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <form className="modal card" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h2>{editing.id == null ? "Add New Item" : "Edit Item"}</h2>
            <div className="field"><label>Item Name</label>
              <input className="input" value={editing.title} onChange={(e) => field("title", e.target.value)} required />
            </div>
            <div className="two">
              <div className="field"><label>Type</label>
                <select className="input" value={editing.type} onChange={(e) => field("type", e.target.value)}>
                  <option>Book</option><option>Movie</option><option>Game</option>
                </select>
              </div>
              <div className="field"><label>Price ($)</label>
                <input className="input" type="number" step="0.01" value={editing.price} onChange={(e) => field("price", e.target.value)} />
              </div>
            </div>
            <div className="field"><label>Stock</label>
              <input className="input" type="number" value={editing.stock} onChange={(e) => field("stock", e.target.value)} />
            </div>
            <div className="field"><label>Description</label>
              <textarea className="input" rows="3" value={editing.description} onChange={(e) => field("description", e.target.value)} />
            </div>
            <div className="modal-actions">
              <button className="btn" type="button" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}

// Styles for this page
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
.modal-backdrop {
  position: fixed; inset: 0; z-index: 50;
  background: rgba(15, 23, 42, .45);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.modal { width: 100%; max-width: 440px; padding: 26px 28px; display: grid; gap: 14px; }
.modal h2 { margin: 0 0 2px; font-size: 22px; color: var(--navy); }
.modal .two { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.modal textarea.input { resize: vertical; font: inherit; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 6px; }
@media (max-width: 640px) {
  .admin-page-head { align-items: stretch; flex-direction: column; }
}
`;
