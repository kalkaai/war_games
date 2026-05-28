export function WarGuardLogo() {
  return (
    <a href="/" className="flex items-center gap-2.5 shrink-0 group">
      {/* Shield icon */}
      <svg
        width="22"
        height="26"
        viewBox="0 0 22 26"
        fill="none"
        aria-hidden="true"
        className="transition-colors group-hover:stroke-purple-300"
      >
        {/* Shield body */}
        <path
          d="M11 1L1 5.5V12c0 6 4.5 10.5 10 12.5 5.5-2 10-6.5 10-12.5V5.5L11 1z"
          fill="rgba(109,40,217,0.25)"
          stroke="rgba(167,139,250,0.9)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* W chevron inside shield */}
        <path
          d="M5 10l2 7 4-5 4 5 2-7"
          stroke="rgba(216,180,254,0.85)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Wordmark */}
      <span className="text-xl font-bold tracking-tight text-white group-hover:text-purple-100 transition-colors">
        WarGuard
      </span>

      {/* Beta badge */}
      <span className="rounded bg-purple-600/70 px-1.5 py-0.5 text-xs font-medium text-purple-100">
        Beta
      </span>
    </a>
  )
}
