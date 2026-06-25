// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Customer login page. Email / password form. Demo only (any email signs in, no database); redirects to the account overview after login.

import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../services/index.js";
import { findUserByEmail } from "../data.js";
import { useAuth } from "../store/AuthContext.jsx";
import { useToast } from "../store/ToastContext.jsx";
import CustomerShell from "../components/CustomerShell.jsx";
import { useTitle } from "../useTitle.js";

export default function Login() {
  useTitle("Login");
  const navigate = useNavigate();
  const { login } = useAuth();
  const showToast = useToast();

  // Submit login: check the email + password against the database. If the database
  // is offline, fall back to demo mode (any email signs in) so the prototype works.
  const onSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");

    try {
      const res = await apiLogin(email, password);   // real lookup + hashed password check
      if (res.ok) {
        login(res.user);
        showToast("Signed in");
        navigate("/home");
      } else {
        showToast(res.reason);   // "Account not found" or "Incorrect password"
      }
    } catch (err) {
      if (err.response) {
        showToast("Login failed. Please try again.");
        return;
      }
      // No response = database/API offline -> demo fallback.
      const known = findUserByEmail(email);
      const profile = known
        ? { name: known.name, email: known.email, role: known.role }
        : { name: email.split("@")[0] || "Member", email, role: "Customer" };
      login(profile);
      showToast("Signed in (offline demo)");
      navigate("/home");
    }
  };

  return (
    <CustomerShell active="Home" accountActive={true}>
      <style>{css}</style>
      <section className="auth-page">
        <h1>My Account</h1>
        <form className="card auth-card" onSubmit={onSubmit}>
          <h2>Sign In</h2>
          {/* Email and password inputs */}
          <div className="field"><label>Email</label><input className="input" name="email" type="email" required /></div>
          <div className="field"><label>Password</label><input className="input" name="password" type="password" required /></div>
          <div className="auth-row">
            <label className="check-row"><input type="checkbox" /> Remember me</label>
            <button className="btn link" type="button" onClick={() => navigate("/register")}>Create Account</button>
          </div>
          <button className="btn primary full" type="submit">Login</button>
          <button className="btn link forgot" type="button" onClick={() => navigate("/forgot")}>Forgot Password?</button>
        </form>
      </section>
    </CustomerShell>
  );
}

// Styles for this page
const css = `
.auth-page { max-width: 460px; margin: 0 auto; }
.auth-page h1 { margin: 0 0 22px; text-align: center; font-size: 30px; color: var(--navy); }
.auth-card { padding: 38px 44px 56px; display: grid; gap: 16px; }
.auth-card h2 { margin: 0 0 10px; font-size: 24px; }
.auth-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.check-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #4b5563;
  font-weight: 700;
}
.forgot { justify-self: center; margin-top: 4px; }
`;
