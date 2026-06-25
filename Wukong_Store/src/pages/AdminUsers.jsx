// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// User management page (admin) with role-based permissions and timed bans.
//
//   - Regular Admin ("Admin"): sees only the "User Accounts" section and can
//     ban / unban customer accounts (no add or delete).
//   - Super Admin ("SuperAdmin"): sees the same "User Accounts" section PLUS an
//     "Administrator Accounts" section where they can add, edit, change the
//     password of, ban / unban, and delete regular admin accounts.
//
// Banning opens a duration picker (1 day ... 10 years / Permanent). The chosen
// length is stored as an expiry date on the row; a ban whose time has passed is
// shown as Active again automatically.
//
// All writes go through the API layer (src/services). If the database/API is
// offline they fall back to a local-only table so the prototype still works.
// The ban status AND its expiry date are saved to the database. For this the
// User table needs two extra columns: "Status" (text) and "BannedUntil"
// (datetime, nullable). If those columns are missing the write just falls back
// to local-only, so nothing breaks either way.

import { useState, useEffect } from "react";
import { users as seedUsers } from "../data.js";
import { getUsers, createUser, updateUser, deleteUser } from "../services/index.js";
import { useAuth } from "../store/AuthContext.jsx";
import { useToast } from "../store/ToastContext.jsx";
import AdminShell from "../components/AdminShell.jsx";
import { useTitle } from "../useTitle.js";

const BLANK = { isNew: true, id: null, originalEmail: null, name: "", email: "", password: "" };

// Ban length options. days = null means a permanent ban.
const BAN_OPTIONS = [
  { label: "1 day", days: 1 },
  { label: "3 days", days: 3 },
  { label: "7 days", days: 7 },
  { label: "1 month", days: 30 },
  { label: "3 months", days: 90 },
  { label: "6 months", days: 182 },
  { label: "1 year", days: 365 },
  { label: "10 years", days: 3650 },
  { label: "Permanent", days: null },
];

const DAY_MS = 24 * 60 * 60 * 1000;

// A suspended ban whose end date has passed counts as Active again.
function effStatus(u) {
  if (u.status === "Suspended" && u.bannedUntil && new Date(u.bannedUntil) <= new Date()) return "Active";
  return u.status;
}
// Text under the status badge: when the ban ends, or "Permanent".
function banInfo(u) {
  if (effStatus(u) !== "Suspended") return null;
  if (!u.bannedUntil) return "Permanent";
  const d = new Date(u.bannedUntil);
  return "until " + d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminUsers() {
  useTitle("User Management");
  const { user } = useAuth();                       // the signed-in admin
  const isSuper = user?.role === "SuperAdmin";      // only the super admin manages admins
  const showToast = useToast();
  const [rows, setRows] = useState(seedUsers);      // sample data until the DB loads
  const [query, setQuery] = useState("");            // search keyword
  const [editing, setEditing] = useState(null);      // admin add/edit modal (super admin only)
  const [banning, setBanning] = useState(null);      // the account whose ban length is being picked
  const [saving, setSaving] = useState(false);

  // Load the real user list from the database (keeps sample data if offline).
  useEffect(() => {
    let alive = true;
    getUsers()
      .then((list) => { if (alive && list && list.length) setRows(list); })
      .catch(() => { /* database offline -> keep sample data */ });
    return () => { alive = false; };
  }, []);

  const match = (u) => `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase());
  const customers = rows.filter((u) => u.role === "Customer" && match(u)); // shoppers
  const admins = rows.filter((u) => u.role === "Admin" && match(u));        // regular admins

  // Apply a timed ban: set status Suspended and store when it ends (null = permanent).
  const applyBan = async (u, opt) => {
    const until = opt.days == null ? null : new Date(Date.now() + opt.days * DAY_MS).toISOString();
    try {
      if (u.id != null) await updateUser(u.id, { status: "Suspended", bannedUntil: until, table: u._table }); // persist to the right table
      showToast(`${u.name} suspended (${opt.label})`);
    } catch {
      showToast(`${u.name} suspended (${opt.label}, offline demo)`);
    }
    setRows((r) => r.map((x) => (x.email === u.email ? { ...x, status: "Suspended", bannedUntil: until, banLabel: opt.label } : x)));
    setBanning(null);
  };

  // Lift a ban immediately.
  const unban = async (u) => {
    try {
      if (u.id != null) await updateUser(u.id, { status: "Active", bannedUntil: null, table: u._table });
      showToast("Account reactivated");
    } catch {
      showToast("Account reactivated (offline demo)");
    }
    setRows((r) => r.map((x) => (x.email === u.email ? { ...x, status: "Active", bannedUntil: null, banLabel: null } : x)));
  };

  // --- Administrator account management (super admin only) ---
  const openAddAdmin = () => setEditing({ ...BLANK });
  const openEditAdmin = (u) =>
    setEditing({ isNew: false, id: u.id ?? null, originalEmail: u.email, name: u.name, email: u.email, password: "" });
  const field = (key, value) => setEditing((e) => ({ ...e, [key]: value }));

  // Save a new or edited administrator. Password is optional on edit (blank = keep).
  const saveAdmin = async (event) => {
    event.preventDefault();
    setSaving(true);
    const name = editing.name.trim() || "Admin";
    const email = editing.email.trim();
    const password = editing.password;
    try {
      if (editing.isNew) {
        const created = await createUser({ name, email, password, role: "Admin" }); // new admin
        setRows((r) => [{ name, email, role: "Admin", status: "Active", ...created }, ...r]);
        showToast("Administrator added");
      } else {
        const patch = { name, email };
        if (password) patch.password = password;     // change the password only if typed
        await updateUser(editing.id, patch);
        setRows((r) => r.map((u) => (u.email === editing.originalEmail ? { ...u, name, email } : u)));
        showToast(password ? "Administrator updated (password changed)" : "Administrator updated");
      }
    } catch {
      // database/API offline -> update only the local table
      if (editing.isNew) {
        setRows((r) => [{ name, email, role: "Admin", status: "Active" }, ...r]);
        showToast("Administrator added (offline demo)");
      } else {
        setRows((r) => r.map((u) => (u.email === editing.originalEmail ? { ...u, name, email } : u)));
        showToast(password ? "Updated, password changed (offline demo)" : "Administrator updated (offline demo)");
      }
    } finally {
      setSaving(false);
      setEditing(null);
    }
  };

  // Delete an administrator account (super admin only).
  const removeAdmin = async (u) => {
    try {
      if (u.id != null) await deleteUser(u.id, u._table);
      showToast("Administrator deleted");
    } catch {
      showToast("Administrator deleted (offline demo)");
    }
    setRows((r) => r.filter((x) => x.email !== u.email));
  };

  // Status badge coloured by state.
  const Badge = ({ status }) => (
    <span className={`status ${status === "Active" ? "good" : status === "Suspended" ? "bad" : "warn"}`}>{status}</span>
  );

  // The ban / unban button used in both tables (reads the effective status).
  const BanButton = ({ u }) =>
    effStatus(u) === "Suspended" ? (
      <button className="table-action edit" type="button" onClick={() => unban(u)}>unban</button>
    ) : (
      <button className="table-action delete" type="button" onClick={() => setBanning(u)}>ban</button>
    );

  // The status cell (badge + ban end note) used in both tables.
  const StatusCell = ({ u }) => (
    <td>
      <Badge status={effStatus(u)} />
      {banInfo(u) && <div className="ban-note">{banInfo(u)}</div>}
    </td>
  );

  return (
    <AdminShell active="User Management">
      <style>{css}</style>
      <div className="admin-page-head">
        <h1>User Management</h1>
        {/* The signed-in admin's level is shown so the available actions are clear. */}
        <span className="role-pill">{isSuper ? "Super Admin" : "Admin"}</span>
      </div>
      {/* Search box (filters both tables) */}
      <form className="search-form management-search" onSubmit={(event) => event.preventDefault()}>
        <input className="search-input" name="query" placeholder="Search by name or email..." value={query} onChange={(event) => setQuery(event.target.value)} />
      </form>

      {/* ---- User Accounts: every admin can ban / unban (no add or delete) ---- */}
      <h2 className="section-title">User Accounts</h2>
      <section className="card table-card">
        <table className="data-table">
          <thead><tr><th>User Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {customers.map((u) => (
              <tr key={u.email}>
                <td><strong>{u.name}</strong></td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <StatusCell u={u} />
                <td><BanButton u={u} /></td>
              </tr>
            ))}
            {customers.length === 0 && <tr><td colSpan={5} className="empty">No user accounts.</td></tr>}
          </tbody>
        </table>
      </section>

      {/* ---- Administrator Accounts: super admin only, full management ---- */}
      {isSuper && (
        <>
          <div className="section-head">
            <h2 className="section-title">Administrator Accounts</h2>
            <button className="btn primary" type="button" onClick={openAddAdmin}>Add Administrator</button>
          </div>
          <section className="card table-card">
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {admins.map((u) => (
                  <tr key={u.email}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <StatusCell u={u} />
                    <td>
                      <button className="table-action edit" type="button" onClick={() => openEditAdmin(u)}>edit</button>
                      <BanButton u={u} />
                      <button className="table-action delete" type="button" onClick={() => removeAdmin(u)}>delete</button>
                    </td>
                  </tr>
                ))}
                {admins.length === 0 && <tr><td colSpan={5} className="empty">No administrator accounts.</td></tr>}
              </tbody>
            </table>
          </section>
        </>
      )}

      {/* Ban-duration picker (shared by both tables) */}
      {banning && (
        <div className="modal-backdrop" onClick={() => setBanning(null)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <h2>Suspend {banning.name}</h2>
            <p className="modal-sub">Choose how long the account stays suspended.</p>
            <div className="ban-options">
              {BAN_OPTIONS.map((opt) => (
                <button key={opt.label} type="button" className={opt.days == null ? "perm" : ""} onClick={() => applyBan(banning, opt)}>
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn" type="button" onClick={() => setBanning(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit administrator modal (super admin only) */}
      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <form className="modal card" onClick={(e) => e.stopPropagation()} onSubmit={saveAdmin}>
            <h2>{editing.isNew ? "Add Administrator" : "Edit Administrator"}</h2>
            <div className="field"><label>Full Name</label>
              <input className="input" value={editing.name} onChange={(e) => field("name", e.target.value)} required />
            </div>
            <div className="field"><label>Email</label>
              <input className="input" type="email" value={editing.email} onChange={(e) => field("email", e.target.value)} required />
            </div>
            <div className="field">
              <label>{editing.isNew ? "Password" : "New Password (leave blank to keep current)"}</label>
              <input className="input" type="password" value={editing.password} onChange={(e) => field("password", e.target.value)} required={editing.isNew} />
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
.role-pill {
  padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 800;
  background: #eef2ff; color: #3730a3;
}
.management-search { width: 100%; margin-bottom: 24px; }
.section-title { margin: 6px 0 12px; font-size: 19px; color: var(--navy); }
.section-head {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  margin: 28px 0 12px;
}
.section-head .section-title { margin: 0; }
.table-card { padding: 8px 4px; overflow-x: auto; }
.empty { text-align: center; color: var(--muted); padding: 18px 0; }
.status {
  display: inline-block; padding: 4px 10px; border-radius: 999px;
  font-size: 12px; font-weight: 700;
}
.status.good { background: #dcfce7; color: #166534; }
.status.warn { background: #fef9c3; color: #854d0e; }
.status.bad  { background: #fee2e2; color: #991b1b; }
.ban-note { font-size: 12px; color: var(--muted); margin-top: 4px; }
.modal-backdrop {
  position: fixed; inset: 0; z-index: 50;
  background: rgba(15, 23, 42, .45);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.modal { width: 100%; max-width: 440px; padding: 26px 28px; display: grid; gap: 14px; }
.modal h2 { margin: 0 0 2px; font-size: 22px; color: var(--navy); }
.modal-sub { margin: 0; color: var(--muted); font-size: 14px; }
.ban-options { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
.ban-options button {
  padding: 12px 8px; border-radius: 12px; border: 1px solid #e5e7eb; background: #fff;
  font-weight: 700; cursor: pointer;
}
.ban-options button:hover { background: #f8fafc; }
.ban-options button.perm { grid-column: 1 / -1; color: #991b1b; border-color: #fecaca; background: #fef2f2; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 6px; }
@media (max-width: 640px) {
  .admin-page-head, .section-head { align-items: stretch; flex-direction: column; }
  .ban-options { grid-template-columns: 1fr 1fr; }
}
`;
