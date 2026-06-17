import { useNavigate } from "react-router-dom";
import { useToast } from "../store/ToastContext.jsx";
import CustomerShell from "../components/CustomerShell.jsx";
import AccountMenu from "../components/AccountMenu.jsx";
import { useTitle } from "../useTitle.js";

export default function Password() {
  useTitle("Update Password");
  const navigate = useNavigate();
  const showToast = useToast();

  const onSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") || "");
    const confirm = String(data.get("confirm") || "");
    if (password.length < 8) { showToast("Password must be at least 8 characters"); return; }
    if (password !== confirm) { showToast("Passwords do not match"); return; }
    showToast("Password updated");
    navigate("/account");
  };

  return (
    <CustomerShell active="Home" accountActive={true}>
      <style>{css}</style>
      <div className="password-layout">
        <AccountMenu active="Update Password" />
        <section className="password-main">
          <h1>Update Password</h1>
          <form className="card password-form" onSubmit={onSubmit}>
            <div className="field"><label>Current Password</label><input className="input" name="current" type="password" required /></div>
            <div className="field"><label>New Password</label><input className="input" name="password" type="password" required /></div>
            <div className="field"><label>Confirm New Password</label><input className="input" name="confirm" type="password" required /></div>
            <p className="rule">Password rules: at least 8 characters.</p>
            <div className="password-actions">
              <button className="btn" type="button" onClick={() => navigate("/account")}>Cancel</button>
              <button className="btn primary" type="submit">Save</button>
            </div>
          </form>
        </section>
      </div>
    </CustomerShell>
  );
}

const css = `
.password-layout {
  display: grid;
  grid-template-columns: 230px 1fr;
  gap: 28px;
  align-items: start;
}
.password-main h1 { margin: 0 0 22px; font-size: 28px; }
.password-form {
  display: grid;
  gap: 18px;
  max-width: 520px;
  padding: 26px 30px;
}
.rule { margin: 0; color: var(--muted); font-size: 14px; }
.password-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
@media (max-width: 980px) {
  .password-layout { grid-template-columns: 1fr; }
}
`;
