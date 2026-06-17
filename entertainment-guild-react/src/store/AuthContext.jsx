import { createContext, useContext, useState } from "react";

const KEY = "entertainment-guild-user";
const AuthContext = createContext(null);

function readUser() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);

  const login = (profile) => {
    localStorage.setItem(KEY, JSON.stringify(profile));
    setUser(profile);
  };

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

export function useAuth() {
  return useContext(AuthContext);
}
