import { useNavigate } from "react-router-dom";
import { findUserByEmail } from "../data.js";
import { useAuth } from "../store/AuthContext.jsx";
import { useToast } from "../store/ToastContext.jsx";
import CustomerShell from "../components/CustomerShell.jsx";
import { useTitle } from "../useTitle.js";

export default function AdminLogin() {
  useTitle("Admin Login");
  const navigate = useNavigate();
  const { login } = useAuth();
  const showToast = useToast();

  const onSubmit = (event) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") || "").trim();
    const account = findUserByEmail(email);
    if (!account || account.role !== "Admin") { showToast("This account is not an administrator"); return; }
    login({ name: account.name, email: account.email, role: "Admin" });
    showToast("Welcome back");
    navigate("/admin");
  };

  return (
    <CustomerShell active="Home" accountActive={true}>
      <style>{css}</style>
      <section className="auth-page">
        <h1>Administrator</h1>
        <form className="card auth-card" onSubmit={onSubmit}>
          <h2>Admin Sign In</h2>
          <p className="admin-note">Access is restricted to authorized administrator accounts. Demo account: admin@example.com</p>
          <div className="field"><label>Email</label><input className="input" name="email" type="email" required /></div>
          <div className="field"><label>Password</label><input className="input" name="password" type="password" required /></div>
          <button className="btn primary full" type="submit">Login</button>
          <button className="btn link back" type="button" onClick={() => navigate("/login-select")}>← Back to account type</button>
        </form>
      </section>
    </CustomerShell>
  );
}

const css = `
.auth-page { max-width: 460px; margin: 0 auto; }
.auth-page h1 { margin: 0 0 22px; text-align: center; font-size: 30px; color: var(--navy); }
.auth-card { padding: 38px 44px 52px; display: grid; gap: 16px; }
.auth-card h2 { margin: 0; font-size: 24px; }
.admin-note {
  margin: 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: #fff7ef;
  color: #92400e;
  font-size: 14px;
  line-height: 1.5;
}
.back { justify-self: center; }
`;
