// Wukong brand mark — a Monkey King badge (gold headband + gem) drawn as inline
// SVG so it stays crisp at any size and needs no image asset.
export default function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Wukong logo">
      <defs>
        <linearGradient id="wk-badge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0612a" />
          <stop offset="1" stopColor="#b53b1d" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#wk-badge)" />
      <circle cx="32" cy="32" r="30" fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="2" />
      <circle cx="14" cy="27" r="8" fill="#f7f2ea" />
      <circle cx="50" cy="27" r="8" fill="#f7f2ea" />
      <circle cx="14" cy="27" r="3.4" fill="#e3915f" />
      <circle cx="50" cy="27" r="3.4" fill="#e3915f" />
      <ellipse cx="32" cy="34" rx="16" ry="17" fill="#f7f2ea" />
      <ellipse cx="32" cy="40" rx="11.5" ry="9" fill="#fffaf3" />
      <ellipse cx="26" cy="33" rx="2.3" ry="3" fill="#26313f" />
      <ellipse cx="38" cy="33" rx="2.3" ry="3" fill="#26313f" />
      <ellipse cx="32" cy="38.5" rx="1.8" ry="1.3" fill="#c98a62" />
      <path d="M29 43 q3 2.5 6 0" stroke="#c08763" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M18 28 Q32 19 46 28" stroke="#f4b860" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <path d="M32 21.5 l3.2 3.2 -3.2 3.2 -3.2 -3.2 z" fill="#d94f2b" stroke="#ffe9c2" strokeWidth="0.8" />
    </svg>
  );
}
