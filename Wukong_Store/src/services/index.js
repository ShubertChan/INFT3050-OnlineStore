// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// API layer entry point (Zhang Lei).
// Lets the frontend import everything from one place, e.g.:
//   import { getProducts, login, createOrder } from "./services";
export * from "./products.js";
export * from "./auth.js";
export * from "./orders.js";
export { default as client, unwrapList } from "./client.js";
