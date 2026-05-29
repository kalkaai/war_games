export function GameidesLogo() {
  return (
    <a href="/" className="flex items-center gap-2.5 shrink-0 group">
      {/* Controller icon */}
      <svg
        width="24"
        height="20"
        viewBox="0 0 24 20"
        fill="none"
        aria-hidden="true"
        className="transition-opacity group-hover:opacity-80"
      >
        {/* Controller body */}
        <path
          d="M5 3 L19 3 Q22 3 22 6 L22 12 Q22 15 19 15 L17 15 L16 19 Q15.5 20 14 20 L10 20 Q8.5 20 8 19 L7 15 L5 15 Q2 15 2 12 L2 6 Q2 3 5 3 Z"
          fill="rgba(109,40,217,0.25)"
          stroke="rgba(167,139,250,0.9)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* D-pad */}
        <path
          d="M7.5 7.5 L7.5 10.5 M6 9 L9 9"
          stroke="rgba(216,180,254,0.85)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Face buttons */}
        <circle cx="15.5" cy="8" r="1.2" stroke="rgba(216,180,254,0.85)" strokeWidth="1.2" />
        <circle cx="17.5" cy="10" r="1.2" stroke="rgba(216,180,254,0.85)" strokeWidth="1.2" />
      </svg>

      {/* Wordmark */}
      <span className="text-xl font-bold tracking-tight text-white group-hover:text-purple-100 transition-colors">
        GAMIDES
      </span>

      {/* Beta badge */}
      <span className="rounded bg-purple-600/70 px-1.5 py-0.5 text-xs font-medium text-purple-100">
        Beta
      </span>
    </a>
  )
}
