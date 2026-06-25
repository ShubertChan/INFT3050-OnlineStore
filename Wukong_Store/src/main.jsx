// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// React entry file. Mounts the root <App /> component onto the page's #root node and starts the whole app.

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // Global base styles

// Find <div id="root"> in index.html and render the whole React app into it.
// <React.StrictMode> is an extra development-time check mode that helps surface issues; it does not affect the final result.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
