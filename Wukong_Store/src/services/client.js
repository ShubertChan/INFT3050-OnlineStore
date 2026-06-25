// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// API client (Zhang Lei) — shared axios instance for the NocoDB REST API.
// Follows the Week 6 lab method exactly:
//   - base path  /api/inft3050   (Vite proxies /api -> http://localhost:3001, see vite.config.js)
//   - auth via the  xc-token  request header
//   - list endpoints return rows wrapped in { list: [...] }
// All other service files (products/auth/orders) reuse this one client.
import axios from "axios";

// The course-shared token from the Week 6 lab. Verify it matches your team's NocoDB token.
// (Better practice: move this into a .env file as VITE_API_TOKEN and read import.meta.env.)
const API_TOKEN = "sPi8tSXBw3BgursDPmfAJz8B3mPaHA6FQ9PWZYJZ";

const client = axios.create({
  baseURL: "/api/inft3050",
  headers: { "xc-token": API_TOKEN },
});

// NocoDB list endpoints return { list: [...], pageInfo: {...} }.
// This helper always gives back a plain array of rows, whatever the shape.
export function unwrapList(res) {
  return res?.data?.list ?? res?.data ?? [];
}

export default client;
