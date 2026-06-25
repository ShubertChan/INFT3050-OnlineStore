// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Custom hook. Sets the browser tab title (document.title) from the title each page passes in.

import { useEffect } from "react";

// Usage: call useTitle("Home") in a page and the tab title becomes "Home | Wukong".
export function useTitle(title) {
  // Whenever title changes, update the browser tab title
  useEffect(() => {
    document.title = `${title} | Wukong`;
  }, [title]);
}
