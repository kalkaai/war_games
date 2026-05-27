/**
 * Formats milliseconds into a human-readable string like "4h 30m" or "45m 20s"
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts: string[] = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (seconds > 0 && hours === 0) parts.push(`${seconds}s`)

  return parts.join(' ') || '0s'
}

/**
 * Formats a future Date into a relative time string like "in 4h 30m"
 */
export function formatTimeUntil(expiresAt: Date): string {
  const ms = expiresAt.getTime() - Date.now()
  if (ms <= 0) return 'expired'
  return `in ${formatDuration(ms)}`
}
