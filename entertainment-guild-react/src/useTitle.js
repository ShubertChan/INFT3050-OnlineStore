import { useEffect } from "react";

// Sets the document title for a page, mirroring the original per-page titles.
export function useTitle(title) {
  useEffect(() => {
    document.title = `${title} | Wukong`;
  }, [title]);
}
