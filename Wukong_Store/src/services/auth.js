// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Auth API (Zhang Lei) — customer + admin accounts via NocoDB.
//
// REAL SCHEMA (course database):
//   - Patrons : UserID, Name, Email, HashPW, Salt          -> CUSTOMER accounts
//   - User    : UserName, Name, Email, HashPW, Salt, IsAdmin -> ADMIN accounts
//
// So: customers register / log in against `Patrons`; admins live in `User` and are
// flagged by `IsAdmin`. Passwords use the schema column `HashPW` (SHA-256 over
// salt + password, via the browser Web Crypto API). Login checks Patrons first,
// then User. (`Status` / `BannedUntil` are not in the schema; ban writes are
// best-effort and only persist if those columns are added.)
import client, { unwrapList } from "./client.js";

const PATRONS = "Patrons"; // customers
const USER = "User";       // admins

// --- password helpers (Web Crypto) ---
async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function makeSalt() {
  const a = new Uint8Array(8);
  crypto.getRandomValues(a);
  return Array.from(a).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Find a row by email in a given table (with a fallback if where-syntax differs).
async function findByEmail(table, email) {
  try {
    const rows = await client.get(`/${table}?where=(Email,eq,${encodeURIComponent(email)})`).then(unwrapList);
    if (rows.length) return rows[0];
  } catch { /* fall through */ }
  const all = await client.get(`/${table}?limit=1000`).then(unwrapList);
  return all.find((u) => (u.Email || "").toLowerCase() === email.toLowerCase()) || null;
}

const idOf = (u) => u.UserID ?? u.ID ?? u.Id ?? u.UserId;
const hashOf = (u) => u.HashPW ?? u.HashedPW; // schema is HashPW; accept legacy too

// REGISTER (customer): hash the password, insert into Patrons.
export async function register({ name, email, password }) {
  const Salt = makeSalt();
  const HashPW = await sha256Hex(Salt + password);
  return client.post(`/${PATRONS}`, { Name: name, Email: email, HashPW, Salt }).then((r) => r.data);
}

// LOGIN: check Patrons (customer) first, then User (admin). Returns { ok, user }.
export async function login(email, password) {
  let row = await findByEmail(PATRONS, email);
  let isAdmin = false;
  if (!row) { row = await findByEmail(USER, email); isAdmin = !!row; }
  if (!row) return { ok: false, reason: "Account not found" };

  const hashed = await sha256Hex((row.Salt ?? "") + password);
  const stored = hashOf(row);
  if (stored !== hashed && stored !== password) return { ok: false, reason: "Incorrect password" };

  // Admins: User.IsAdmin distinguishes admin from super admin is not in the schema,
  // so a User row is treated as "Admin" here (super-admin is a front-end convention).
  const role = isAdmin ? "Admin" : "Customer";
  return { ok: true, user: { id: idOf(row), name: row.Name, email: row.Email, role } };
}

// --- Admin user management ---

// Map a row to the admin-table shape, remembering which table it came from.
function toUser(u, role, table) {
  return {
    id: idOf(u),
    name: u.Name ?? "",
    email: u.Email ?? "",
    role,
    status: u.Status ?? "Active",
    bannedUntil: u.BannedUntil ?? null,
    _table: table, // "Patrons" (customer) or "User" (admin) — used by update/delete
  };
}

// READ: customers (Patrons) + admins (User), combined for the admin table.
export async function getUsers() {
  const [patrons, admins] = await Promise.all([
    client.get(`/${PATRONS}?limit=1000`).then(unwrapList).catch(() => []),
    client.get(`/${USER}?limit=1000`).then(unwrapList).catch(() => []),
  ]);
  return [
    ...patrons.map((p) => toUser(p, "Customer", PATRONS)),
    ...admins.map((a) => toUser(a, "Admin", USER)),
  ];
}

// CREATE (admin): add an administrator account into User (IsAdmin = true).
export async function createUser({ name, email, password = "changeme" }) {
  const Salt = makeSalt();
  const HashPW = await sha256Hex(Salt + password);
  const created = await client
    .post(`/${USER}`, { Name: name, UserName: email, Email: email, HashPW, Salt, IsAdmin: true })
    .then((r) => r.data);
  return toUser(created, "Admin", USER);
}

// UPDATE: patch a customer (Patrons) or admin (User) row. Pass `table` from the
// row's _table; defaults to User. Ban fields (Status/BannedUntil) are best-effort.
export async function updateUser(id, { name, email, status, bannedUntil, password, table = USER } = {}) {
  const patch = {};
  if (name != null) patch.Name = name;
  if (email != null) patch.Email = email;
  if (status != null) patch.Status = status;
  if (bannedUntil !== undefined) patch.BannedUntil = bannedUntil;
  if (password) { patch.Salt = makeSalt(); patch.HashPW = await sha256Hex(patch.Salt + password); }
  await client.patch(`/${table}/${id}`, patch);
  return true;
}

// DELETE: remove a customer or admin row (table from the row's _table).
export async function deleteUser(id, table = USER) {
  return client.delete(`/${table}/${id}`).then((r) => r.data);
}
