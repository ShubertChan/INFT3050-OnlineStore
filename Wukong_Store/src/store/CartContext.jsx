// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Cart state management. Stores the cart (in localStorage) and exposes add/decrease/remove, clear and totals.
// Each item's details (name, price) are resolved from the Catalog.

import { createContext, useContext, useState } from "react";
import { useCatalog } from "./CatalogContext.jsx";

const KEY = "entertainment-guild-cart"; // localStorage key for the cart
const CartContext = createContext(null);

// Read the cart from localStorage (an array, each item like { id, qty })
function readCart() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return [];
    const saved = JSON.parse(raw);
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { getById } = useCatalog();             // Look up full product info by id from the catalog
  const [lines, setLines] = useState(readCart); // Raw cart data: [{id, qty}, ...]

  // A single "save" action: write back to localStorage + update state
  const persist = (next) => {
    localStorage.setItem(KEY, JSON.stringify(next));
    setLines(next);
  };

  // Add an item: bump the quantity if already in the cart, otherwise add a new line
  const add = (id, qty = 1) => {
    const existing = lines.find((line) => line.id === id);
    if (existing) {
      persist(lines.map((line) => (line.id === id ? { ...line, qty: line.qty + qty } : line)));
    } else {
      persist([...lines, { id, qty }]);
    }
  };

  // Change an item's quantity (minimum 1)
  const updateQty = (id, qty) => {
    const nextQty = Math.max(1, qty);
    persist(lines.map((line) => (line.id === id ? { ...line, qty: nextQty } : line)));
  };

  const remove = (id) => persist(lines.filter((line) => line.id !== id)); // Remove a line
  const clear = () => persist([]);                                        // Empty the cart

  // Enrich the raw {id, qty} with full product info and a line total for display
  const items = lines.map((line) => {
    const product = getById(line.id);
    return { ...line, product, total: product.price * line.qty };
  });
  const count = lines.reduce((sum, line) => sum + line.qty, 0);      // Total item count
  const subtotal = items.reduce((sum, line) => sum + line.total, 0); // Items subtotal
  const shipping = subtotal > 0 ? 4 : 0;                            // Shipping (demo: flat $4)
  const tax = subtotal > 0 ? 2 : 0;                                // Tax (demo: flat $2)
  const summary = { subtotal, shipping, tax, total: subtotal + shipping + tax, count };

  return (
    <CartContext.Provider value={{ items, count, summary, add, updateQty, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

// Convenience hook: in a page, const { items, summary, add, ... } = useCart()
export function useCart() {
  return useContext(CartContext);
}
