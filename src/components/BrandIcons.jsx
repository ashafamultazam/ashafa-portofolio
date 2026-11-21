// Ikon sederhana untuk teknologi yang tidak tersedia di react-icons
// (Power BI, Canva, Matplotlib). Ini penanda bergaya, bukan logo resmi.
export function PowerBiIcon({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="6" y="22" width="10" height="20" rx="3" fill="#E8B800" />
      <rect x="19" y="12" width="10" height="30" rx="3" fill="#F2C811" />
      <rect x="32" y="4" width="10" height="38" rx="3" fill="#F9DE6B" />
    </svg>
  )
}

export function CanvaIcon({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="canva-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00C4CC" />
          <stop offset="1" stopColor="#7D2AE8" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#canva-g)" />
      <path
        d="M30.5 18.5a8.5 8.5 0 1 0 0 11"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function MatplotlibIcon({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="19" fill="none" stroke="#5B8DB8" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="12" fill="none" stroke="#5B8DB8" strokeWidth="1.5" opacity="0.6" />
      <circle cx="24" cy="24" r="5" fill="none" stroke="#5B8DB8" strokeWidth="1.5" opacity="0.6" />
      <path d="M24 5v38M5 24h38" stroke="#5B8DB8" strokeWidth="1.5" opacity="0.6" />
      <path d="M24 24 38 14" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 24 12 34" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
