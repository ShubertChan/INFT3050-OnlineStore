import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext.jsx";
import { useToast } from "../store/ToastContext.jsx";

const ITEMS = [
  ["Account Overview", "/account"],
  ["Profile Information", "/account"],
  ["Address Book", "/address"],
  ["Order History", "/account"],
  ["Update Password", "/password"],
  ["Payment Methods", "/payment"]
];

export default function AccountMenu({ active }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const showToast = useToast();

  const onLogout = () => {
    logout();
    showToast("Signed out");
    navigate("/home");
  };

  return (
    <aside className="side-menu">
      {ITEMS.map(([label, to]) => (
        <button key={label} className={active === label ? "active" : ""} type="button" onClick={() => navigate(to)}>{label}</button>
      ))}
      <button type="button" onClick={onLogout}>Logout</button>
    </aside>
  );
}
