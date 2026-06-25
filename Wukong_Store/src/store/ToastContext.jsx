// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Bottom-right toast popup manager. Exposes useToast() to show a brief message after an action.

import { createContext, useContext, useRef, useState, useCallback } from "react";

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [message, setMessage] = useState("");   // Toast text
  const [visible, setVisible] = useState(false); // Whether it is visible
  const timer = useRef();                        // Timer used to auto-hide

  // Call it to show a toast; it disappears after 2.2 seconds
  const showToast = useCallback((text) => {
    setMessage(text);
    setVisible(true);
    clearTimeout(timer.current); // Clear the previous timer first to avoid flicker
    timer.current = setTimeout(() => setVisible(false), 2200);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {/* This little bar is the toast popup; the show class reveals it when visible */}
      <div id="toast" className={visible ? "show" : ""}>{message}</div>
    </ToastContext.Provider>
  );
}

// Convenience hook: in a page, const toast = useToast(); toast("Added to cart")
export function useToast() {
  return useContext(ToastContext);
}
