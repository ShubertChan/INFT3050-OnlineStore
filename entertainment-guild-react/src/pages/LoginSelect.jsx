import { useNavigate } from "react-router-dom";
import CustomerShell from "../components/CustomerShell.jsx";
import { useTitle } from "../useTitle.js";

export default function LoginSelect() {
  useTitle("Sign In");
  const navigate = useNavigate();

  return (
    <CustomerShell active="Home" accountActive={true}>
      <style>{css}</style>
      <section className="select-page">
        <h1>Sign In</h1>
        <p className="select-sub">Choose how you want to sign in.</p>
        <div className="select-grid">
          <button className="select-card" type="button" onClick={() => navigate("/login")}>
            <span className="select-icon user" aria-hidden="true">👤</span>
            <span className="select-name">Customer</span>
            <span className="select-desc">Shop products and manage your orders, addresses, and account.</span>
            <span className="select-go">Continue →</span>
          </button>
          <button className="select-card" type="button" onClick={() => navigate("/admin-login")}>
            <span className="select-icon admin" aria-hidden="true">🛡️</span>
            <span className="select-name">Administrator</span>
            <span className="select-desc">Manage items, users, and orders from the admin dashboard.</span>
            <span className="select-go">Continue →</span>
          </button>
        </div>
      </section>
    </CustomerShell>
  );
}

const css = `
.select-page { max-width: 760px; margin: 0 auto; text-align: center; }
.select-page h1 { margin: 0 0 8px; font-size: 32px; color: var(--navy); }
.select-sub { margin: 0 0 28px; color: var(--muted); font-size: 17px; }
.select-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}
.select-card {
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 34px 28px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--paper);
  text-align: center;
}
.select-card:hover { border-color: #ffc6b5; }
.select-icon {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #fff0ea;
  font-size: 30px;
}
.select-icon.admin { background: #eef2ff; }
.select-name { font-size: 22px; font-weight: 800; color: var(--navy); }
.select-desc { color: var(--muted); line-height: 1.5; }
.select-go { color: var(--primary); font-weight: 800; }
@media (max-width: 680px) {
  .select-grid { grid-template-columns: 1fr; }
}
`;
