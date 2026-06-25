// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Login state management. Stores the current user (in localStorage) and exposes login/logout.
// Demo only: not connected to a real database, so the login check is fake.

import { createContext, useContext, useState } from "react";

const KEY = "entertainment-guild-user"; // localStorage key for the signed-in user
const AuthContext = createContext(null); // Create a global container for the login info

// Read the last signed-in user from localStorage (stays signed in across refreshes)
function readUser() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null; // Treat corrupted data as signed out
  }
}

// Provider: wraps the app so every page can access the login state
export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser); // Current user (null = signed out)

  // Login: save the user info to localStorage and update state
  const login = (profile) => {
    localStorage.setItem(KEY, JSON.stringify(profile));
    setUser(profile);
  };

  // Logout: clear the saved user info
  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Convenience hook: in a page, const { user, login, logout } = useAuth()
export function useAuth() {
  return useContext(AuthContext);
}
