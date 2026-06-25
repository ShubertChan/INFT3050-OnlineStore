// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Local storage for Contact-form messages; data lives in the browser's localStorage.

const KEY = "entertainment-guild-feedback"; // localStorage key for the feedback list

// Read all feedback entries (array); returns an empty array if missing or corrupted
export function readFeedback() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

// Add a feedback entry: attach an id and timestamp, prepend it, then save back to localStorage
export function addFeedback(entry) {
  const list = readFeedback();
  list.unshift({ ...entry, id: Date.now(), createdAt: new Date().toISOString() });
  localStorage.setItem(KEY, JSON.stringify(list));
  return list;
}
