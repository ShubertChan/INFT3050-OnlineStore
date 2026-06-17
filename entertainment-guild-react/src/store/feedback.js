// Contact-form submissions are stored in localStorage so the form is fully
// operable without a backend.

const KEY = "entertainment-guild-feedback";

export function readFeedback() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function addFeedback(entry) {
  const list = readFeedback();
  list.unshift({ ...entry, id: Date.now(), createdAt: new Date().toISOString() });
  localStorage.setItem(KEY, JSON.stringify(list));
  return list;
}
