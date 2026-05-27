/**
 * Parses a duration string like "4h30m", "2h", "45m", "1h30m20s"
 * Returns duration in milliseconds, or null if invalid.
 */
export function parseDuration(input: string): number | null {
  const clean = input.trim().toLowerCase()
  const regex = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/
  const match = clean.match(regex)

  if (!match || (!match[1] && !match[2] && !match[3])) return null

  const hours = parseInt(match[1] ?? '0')
  const minutes = parseInt(match[2] ?? '0')
  const seconds = parseInt(match[3] ?? '0')

  const ms = (hours * 3600 + minutes * 60 + seconds) * 1000
  return ms > 0 ? ms : null
}
