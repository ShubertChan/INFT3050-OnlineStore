// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Address book page. Fill in / save a shipping address (street, city, state, postcode, country). Demo only.

import { useNavigate } from "react-router-dom";
import { useToast } from "../store/ToastContext.jsx";
import CustomerShell from "../components/CustomerShell.jsx";
import AccountMenu from "../components/AccountMenu.jsx";
import { useTitle } from "../useTitle.js";

export default function Address() {
  useTitle("Address Book");
  const navigate = useNavigate();
  const showToast = useToast();

  // Save address (demo: no backend, just a toast then back to the account page)
  const onSubmit = (event) => {
    event.preventDefault();
    showToast("Address saved");
    navigate("/account");
  };

  return (
    <CustomerShell active="Home" accountActive={true}>
      <style>{css}</style>
      <div className="address-layout">
        <AccountMenu active="Address Book" />{/* Left account menu */}
        <section className="address-main">
          <h1 className="section-title">Address Book</h1>
          {/* Address form fields */}
          <form className="card address-form" onSubmit={onSubmit}>
            <div className="field full"><label htmlFor="line1">Address Line 1 *</label><input className="input" id="line1" name="line1" placeholder="Enter street address" required /></div>
            <div className="field"><label htmlFor="city">Suburb / City *</label><input className="input" id="city" name="city" required /></div>
            <div className="field"><label htmlFor="state">State *</label><input className="input" id="state" name="state" required /></div>
            <div className="field"><label htmlFor="postcode">Postcode *</label><input className="input" id="postcode" name="postcode" required /></div>
            <div className="field"><label htmlFor="country">Country *</label><input className="input" id="country" name="country" defaultValue="Singapore" required /></div>
            <div className="form-actions full">
              <button className="btn" type="button" onClick={() => navigate("/account")}>Cancel</button>
              <button className="btn primary" type="submit">Save Address</button>
            </div>
          </form>
        </section>
      </div>
    </CustomerShell>
  );
}

// Styles for this page
const css = `
.address-layout {
  display: grid;
  grid-template-columns: 230px 1fr;
  gap: 28px;
  align-items: start;
}
.address-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  padding: 26px 30px;
}
.address-form .full { grid-column: 1 / -1; }
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
@media (max-width: 980px) {
  .address-layout { grid-template-columns: 1fr; }
  .address-form { grid-template-columns: 1fr; }
}
`;
