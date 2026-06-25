// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Product catalog (shared app-wide). Loads products once: prefers database data, falls back to the sample data in data.js.
// Home / Search / ProductDetail / Cart all read products from here, keeping the data consistent.

// Loads the product catalogue ONCE for the whole app.
// It starts with the static sample data (so the site works even with NO backend
// running), then replaces it with real data from the database when the request
// succeeds. Every page reads products from here, so search, product detail and the
// cart all stay consistent.
import { createContext, useContext, useState, useEffect } from "react";
import { products as fallbackProducts } from "../data.js";
import { getProducts } from "../services/index.js";

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState(fallbackProducts); // sample data first
  const [loading, setLoading] = useState(true);
  const [fromDb, setFromDb] = useState(false);
  const [error, setError] = useState(null); // why the DB load failed (shown on Search page)

  useEffect(() => {
    let alive = true;
    getProducts()
      .then((list) => {
        if (alive && list && list.length) {
          setProducts(list); // swap sample data for real database data
          setFromDb(true);
        }
      })
      .catch((err) => {
        console.error("Database not reachable - keeping sample data:", err);
        if (alive) {
          const status = err?.response?.status;
          setError(status ? `HTTP ${status} ${err?.response?.statusText || ""}`.trim() : (err?.message || String(err)));
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const getById = (id) =>
    products.find((p) => p.id === String(id)) || products[0];

  return (
    <CatalogContext.Provider value={{ products, loading, fromDb, getById, error }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  return useContext(CatalogContext);
}
