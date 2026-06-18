// Static catalog / seed data. In the original this lived in state.js; here it is
// plain data with no DOM access, imported by components as needed.

export const products = [
  {
    id: "archive",
    title: "The Archive Key",
    type: "Book",
    price: 17,
    homePrice: 10,
    stock: 40,
    letter: "B",
    color: "#c9460b",
    description: "A curated book release for Wukong members.",
    details: "Author, format, language, release date, and delivery information can be placed here.",
    shipping: "Ready to ship"
  },
  {
    id: "interstellar",
    title: "Interstellar",
    type: "Movie",
    price: 14,
    homePrice: 15,
    stock: 24,
    letter: "M",
    color: "#2855c6",
    description: "A cinematic pick for long weekend viewing.",
    details: "Digital format, language, release date, and device compatibility can be placed here.",
    shipping: "Digital copy"
  },
  {
    id: "galaxy",
    title: "Galaxy Quest",
    type: "Game",
    price: 20,
    homePrice: 20,
    stock: 12,
    letter: "G",
    color: "#7138d5",
    description: "A colorful adventure game for Wukong members.",
    details: "Platform, players, genre, and delivery information can be placed here.",
    shipping: "Instant access"
  },
  {
    id: "bundle",
    title: "Bundle Deal",
    type: "Deals",
    price: 30,
    homePrice: 30,
    stock: 8,
    letter: "D",
    color: "#0f9668",
    description: "A mixed entertainment bundle with member pricing.",
    details: "Bundle contents and delivery information can be placed here.",
    shipping: "Ready to ship"
  }
];

// Search results are backed by the real products so every result has a valid id.
export const searchProducts = products;

export const orders = [
  { id: "#10001", customer: "James", date: "May 20, 2026", items: 3, total: 51, status: "Completed" },
  { id: "#10002", customer: "Emma", date: "May 21, 2026", items: 1, total: 17, status: "Completed" },
  { id: "#10003", customer: "Lee", date: "May 22, 2026", items: 2, total: 39, status: "Processing" }
];

export const users = [
  { name: "John", email: "111@qq.com", role: "Customer", status: "Active" },
  { name: "Emma", email: "emma@example.com", role: "Customer", status: "Active" },
  { name: "Admin Lee", email: "admin@example.com", role: "Admin", status: "Active" },
  { name: "Guest User", email: "guest@example.com", role: "Customer", status: "Pending" }
];

export function getProduct(id) {
  return products.find((product) => product.id === id) || products[0];
}

// Stands in for a database lookup; used by the customer and admin login screens.
export function findUserByEmail(email) {
  const target = String(email || "").trim().toLowerCase();
  return users.find((user) => user.email.toLowerCase() === target) || null;
}

export function money(value) {
  return `$${value}`;
}
