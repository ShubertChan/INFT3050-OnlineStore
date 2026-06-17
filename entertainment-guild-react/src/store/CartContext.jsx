import { createContext, useContext, useState } from "react";
import { getProduct } from "../data.js";

const KEY = "entertainment-guild-cart";
const CartContext = createContext(null);

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
  const [lines, setLines] = useState(readCart);

  const persist = (next) => {
    localStorage.setItem(KEY, JSON.stringify(next));
    setLines(next);
  };

  const add = (id, qty = 1) => {
    const existing = lines.find((line) => line.id === id);
    if (existing) {
      persist(lines.map((line) => (line.id === id ? { ...line, qty: line.qty + qty } : line)));
    } else {
      persist([...lines, { id, qty }]);
    }
  };

  const updateQty = (id, qty) => {
    const nextQty = Math.max(1, qty);
    persist(lines.map((line) => (line.id === id ? { ...line, qty: nextQty } : line)));
  };

  const remove = (id) => persist(lines.filter((line) => line.id !== id));
  const clear = () => persist([]);

  const items = lines.map((line) => {
    const product = getProduct(line.id);
    return { ...line, product, total: product.price * line.qty };
  });
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  const subtotal = items.reduce((sum, line) => sum + line.total, 0);
  const shipping = subtotal > 0 ? 4 : 0;
  const tax = subtotal > 0 ? 2 : 0;
  const summary = { subtotal, shipping, tax, total: subtotal + shipping + tax, count };

  return (
    <CartContext.Provider value={{ items, count, summary, add, updateQty, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
