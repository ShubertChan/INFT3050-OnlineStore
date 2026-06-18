import { useState } from "react";
import { users as seedUsers } from "../data.js";
import { useToast } from "../store/ToastContext.jsx";
import AdminShell from "../components/AdminShell.jsx";
import { useTitle } from "../useTitle.js";

export default function AdminUsers() {
  useTitle("User Management");
  const showToast = useToast();
  const [rows, setRows] = useState(seedUsers);
  const [query, setQuery] = useState("");

  const visible = rows.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase()));
  const remove = (email) => {
    setRows((current) => current.filter((user) => user.email !== email));
    showToast("User deleted from this demo table");
  };

  return (
    <AdminShell active="User Management">
      <style>{css}</style>
      <div className="admin-page-head">
        <h1>User Management</h1>
        <button className="btn primary" type="button" onClick={() => showToast("New user form opened")}>Add New User</button>
      </div>
      <form className="search-form management-search" onSubmit={(event) => event.preventDefault()}>
        <input className="search-input" name="query" placeholder="Search users by names or email..." value={query} onChange={(event) => setQuery(event.target.value)} />
      </form>
      <section className="card table-card">
        <table className="data-table">
          <thead><tr><th>User Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {visible.map((user) => (
              <tr key={user.email}>
                <td><strong>{user.name}</strong></td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td><span className={`status ${user.status === "Active" ? "good" : "warn"}`}>{user.status}</span></td>
                <td>
                  <button className="table-action edit" type="button" onClick={() => showToast("Edit user")}>edit</button>
                  <button className="table-action delete" type="button" onClick={() => remove(user.email)}>delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <div className="management-foot">
        <span></span>
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
