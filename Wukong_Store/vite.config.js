// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Vite build / dev-server config. Enables the React plugin and sets up the /api proxy: requests starting with /api are forwarded to the local backend at localhost:3001.

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with "/api" is forwarded to the local backend (NocoDB)
      // running on port 3001. This is how the website talks to the database in dev,
      // and it also avoids CORS errors.
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
