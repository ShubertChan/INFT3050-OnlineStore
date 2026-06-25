// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Account-centre side menu (overview / profile / address book / orders / change password / logout), shared by account pages.

import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext.jsx";
import { useToast } from "../store/ToastContext.jsx";

// Menu items: [label, target to navigate to on click]
const ITEMS = [
  ["Account Overview", "/account"],
  ["Profile Information", "/account"],
  ["Address Book", "/address"],
  ["Order History", "/account"],
  ["Update Password", "/password"],
  ["Payment Methods", "/payment"]
];

// props: active (the menu item text for the current page, used to highlight)
export default function AccountMenu({ active }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const showToast = useToast();

  // Click "Logout": clear login state + toast + back to home
  const onLogout = () => {
    logout();
    showToast("Signed out");
    navigate("/home");
  };

  return (
    <aside className="side-menu">
      {/* Render each menu item; the current one gets the active class */}
      {ITEMS.map(([label, to]) => (
        <button key={label} className={active === label ? "active" : ""} type="button" onClick={() => navigate(to)}>{label}</button>
      ))}
      <button type="button" onClick={onLogout}>Logout</button>
    </aside>
  );
}
