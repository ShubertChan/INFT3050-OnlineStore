import { useNavigate } from "react-router-dom";
import { useToast } from "../store/ToastContext.jsx";
import CustomerShell from "../components/CustomerShell.jsx";
import { useTitle } from "../useTitle.js";

export default function Forgot() {
  useTitle("Forgot Password");
  const navigate = useNavigate();
  const showToast = useToast();

  const onSubmit = (event) => {
    event.preventDefault();
    showToast("Reset link sent");
    navigate("/login");
  };

  return (
    <CustomerShell active="Home" accountActive={true}>
      <style>{css}</style>
      <section className="auth-page">
        <h1>Forgot Password</h1>
        <form className="card auth-card" onSubmit={onSubmit}>
          <h2>Reset your password</h2>
          <p>Enter your email address. We will send a password reset link.</p>
          <div className="field"><label>Email</label><input className="input" name="email" type="email" required /></div>
          <button className="btn primary full" type="submit">Send reset link</button>
          <button className="btn link back" type="button" onClick={() => navigate("/login")}>Back to sign in</button>
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
.auth-card p { margin: 0; color: var(--muted); line-height: 1.5; }
.back { justify-self: center; }
`;
