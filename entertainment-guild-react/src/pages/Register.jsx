import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext.jsx";
import { useToast } from "../store/ToastContext.jsx";
import CustomerShell from "../components/CustomerShell.jsx";
import { useTitle } from "../useTitle.js";

export default function Register() {
  useTitle("Create Account");
  const navigate = useNavigate();
  const { login } = useAuth();
  const showToast = useToast();

  const onSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get("terms")) { showToast("Please agree to the terms"); return; }
    if (data.get("password") !== data.get("confirm")) { showToast("Passwords do not match"); return; }
    const name = String(data.get("name") || "").trim() || "Member";
    const email = String(data.get("email") || "").trim();
    login({ name, email, role: "Customer" });
    showToast("Account created");
    navigate("/home");
  };

  return (
    <CustomerShell active="Home" accountActive={true}>
      <style>{css}</style>
      <section className="auth-page">
        <h1>Create Account</h1>
        <form className="card auth-card" onSubmit={onSubmit}>
          <h2>Sign Up</h2>
          <div className="field"><label>Full Name</label><input className="input" name="name" required /></div>
          <div className="field"><label>Email</label><input className="input" name="email" type="email" required /></div>
          <div className="field"><label>Password</label><input className="input" name="password" type="password" required /></div>
          <div className="field"><label>Confirm Password</label><input className="input" name="confirm" type="password" required /></div>
          <label className="check-row"><input type="checkbox" name="terms" /> I agree to the Terms</label>
          <button className="btn primary full" type="submit">Create Account</button>
          <p>Already have an account? <button className="btn link" type="button" onClick={() => navigate("/login")}>Log in</button></p>
        </form>
      </section>
    </CustomerShell>
  );
}

const css = `
.auth-page { max-width: 460px; margin: 0 auto; }
.auth-page h1 { margin: 0 0 22px; text-align: center; font-size: 30px; color: var(--navy); }
.auth-card { padding: 38px 44px 30px; display: grid; gap: 16px; }
.auth-card h2 { margin: 0 0 10px; font-size: 24px; }
.check-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #4b5563;
  font-weight: 700;
}
.auth-card p { margin: 6px 0 0; text-align: center; color: var(--muted); }
`;
