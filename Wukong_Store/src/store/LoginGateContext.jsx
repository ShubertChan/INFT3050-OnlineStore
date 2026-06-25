// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Login gate. If a signed-out user tries to add to cart, this shows a small modal
// that tells them they must sign in first, with a button that takes them to the
// login page. (No inline login here — it simply routes to the sign-in page.)
//
// Usage in a page:
//   const { requireLogin } = useLoginGate();
//   onClick={() => requireLogin(() => add(product.id, 1))}

import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

const LoginGateContext = createContext(null);

export function LoginGateProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // If signed in, run the action now; otherwise open the "please sign in" modal.
  const requireLogin = (action) => {
    if (user) { action?.(); return; }
    setOpen(true);
  };

  const close = () => setOpen(false);
  const goLogin = () => { setOpen(false); navigate("/login-select"); }; // -> login page

  return (
    <LoginGateContext.Provider value={{ requireLogin }}>
      {children}
      {open && (
        <div className="lg-backdrop" onClick={close}>
          <style>{css}</style>
          <div className="lg-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Please sign in first</h2>
            <p className="lg-sub">You need to log in before adding items to your cart.</p>
            <div className="lg-actions">
              <button type="button" className="btn" onClick={close}>Cancel</button>
              <button type="button" className="btn primary" onClick={goLogin}>Go to Login</button>
            </div>
          </div>
        </div>
      )}
    </LoginGateContext.Provider>
  );
}

// Safe hook: if used outside the provider it just runs the action (no crash).
export function useLoginGate() {
  return useContext(LoginGateContext) || { requireLogin: (a) => a?.() };
}

const css = `
.lg-backdrop {
  position: fixed; inset: 0; z-index: 60;
  background: rgba(15, 23, 42, .45);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.lg-modal {
  width: 100%; max-width: 380px;
  background: #fff; border-radius: 18px;
  padding: 28px 30px; display: grid; gap: 14px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, .25);
}
.lg-modal h2 { margin: 0; font-size: 22px; color: var(--navy); }
.lg-sub { margin: 0; color: var(--muted); font-size: 14px; }
.lg-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
`;
