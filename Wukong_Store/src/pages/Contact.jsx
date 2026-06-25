// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Contact us page. Message form (saved to localStorage on submit) + contact details.

import { useState } from "react";
import { addFeedback } from "../store/feedback.js";
import { useToast } from "../store/ToastContext.jsx";
import CustomerShell from "../components/CustomerShell.jsx";
import { useTitle } from "../useTitle.js";

// Feedback type options: [value, label]
const FEEDBACK_TYPES = [
  ["general", "General Inquiry"],
  ["product", "Product Question"],
  ["order", "Order Issue"],
  ["bug", "Bug Report"],
  ["suggestion", "Suggestion"]
];

export default function Contact() {
  useTitle("Contact");
  const showToast = useToast();
  const [type, setType] = useState("general"); // Currently selected feedback type
  const [sent, setSent] = useState(null);       // Confirmation info after a successful submit

  // Submit feedback: validate required fields -> save to localStorage (feedback) -> show a confirmation
  const onSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const entry = {
      type,
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      subject: String(data.get("subject") || "").trim(),
      message: String(data.get("message") || "").trim()
    };
    if (!entry.name || !entry.email || !entry.subject || !entry.message) {
      showToast("Please fill in all required fields");
      return;
    }
    addFeedback(entry);
    showToast("Thanks! Your feedback has been submitted");
    const found = FEEDBACK_TYPES.find(([value]) => value === type);
    setSent({ label: found ? found[1] : "General Inquiry", name: entry.name, email: entry.email });
    form.reset();
    setType("general");
  };

  return (
    <CustomerShell active="Contact">
      <style>{css}</style>
      <section className="contact-page">
        <header className="contact-head">
          <h1>Contact Us</h1>
          <p>Have a question or feedback? Pick a topic and send us a message.</p>
        </header>
        <div className="contact-grid">
          <form className="card contact-form" onSubmit={onSubmit}>
            <div className="field">
              <label>Feedback Type</label>
              <div className="type-options">
                {FEEDBACK_TYPES.map(([value, label]) => (
                  <button key={value} className={`type-chip ${type === value ? "active" : ""}`} type="button" onClick={() => setType(value)}>{label}</button>
                ))}
              </div>
            </div>
            <div className="two">
              <div className="field"><label>Name *</label><input className="input" name="name" required /></div>
              <div className="field"><label>Email *</label><input className="input" name="email" type="email" required /></div>
            </div>
            <div className="field"><label>Subject *</label><input className="input" name="subject" required /></div>
            <div className="field">
              <label>Message *</label>
              <textarea className="input textarea" name="message" rows="6" required placeholder="Describe your question or feedback..."></textarea>
            </div>
            <button className="btn primary full" type="submit">Submit Feedback</button>
          </form>
          <aside className="card contact-side">
            <h2>Other ways to reach us</h2>
            <p><b>Email</b><br />support@wukong.com</p>
            <p><b>Hours</b><br />Mon–Fri, 9am–6pm</p>
            {sent && (
              <div className="contact-sent">
                <p className="sent-ok">✓ Submitted</p>
                <p>We received your <b>{sent.label}</b> message, {sent.name}. We will reply to <b>{sent.email}</b>.</p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </CustomerShell>
  );
}

const css = `
.contact-page { max-width: 980px; margin: 0 auto; }
.contact-head { margin-bottom: 24px; }
.contact-head h1 { margin: 0 0 6px; font-size: 30px; color: var(--navy); }
.contact-head p { margin: 0; color: var(--muted); }
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 26px;
  align-items: start;
}
.contact-form {
  padding: 26px 30px;
  display: grid;
  gap: 18px;
}
.type-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.type-chip {
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--paper);
  font-weight: 700;
  color: #4b5563;
}
.type-chip.active {
  border-color: var(--primary);
  background: #fff0ea;
  color: var(--primary);
}
.textarea {
  min-height: 140px;
  padding: 14px 16px;
  resize: vertical;
}
.contact-side { padding: 24px 26px; }
.contact-side h2 { margin: 0 0 14px; font-size: 20px; }
.contact-side p { margin: 0 0 16px; color: #4b5563; line-height: 1.5; }
.contact-sent {
  margin-top: 8px;
  padding: 16px;
  border-radius: 12px;
  background: #ecfdf3;
}
.sent-ok { color: #138044; font-weight: 800; margin: 0 0 8px; }
.contact-sent p { margin: 0; color: #356152; }
@media (max-width: 980px) {
  .contact-grid { grid-template-columns: 1fr; }
}
`;
