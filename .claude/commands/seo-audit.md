Audit SEO metadata and structured data for the WarGuard web app.

Page to audit (optional): $ARGUMENTS

If no page is specified, audit all pages in `web/app/`.

## What to check

### Metadata (per page)
- [ ] `<title>` tag present and unique — not just the site name
- [ ] `<meta name="description">` present, 120–160 characters, includes game-relevant keywords
- [ ] `export const metadata` (Next.js App Router) or `<Head>` used — NOT both
- [ ] Open Graph tags: `og:title`, `og:description`, `og:image` all present
- [ ] `og:image` resolves to an actual image (not a placeholder path)
- [ ] Canonical URL set (`alternates.canonical` in metadata export)

### Heading hierarchy
- [ ] Each page has exactly one `<h1>`
- [ ] `<h2>` used for major sections, `<h3>` for subsections — no skipped levels
- [ ] `<h1>` includes the primary keyword for that page (e.g., "Last Z HQ Upgrade Levels")

### Structured data (JSON-LD)
- [ ] Reference table pages (HQ, research) have `FAQPage` or `Table` schema where appropriate
- [ ] No structured data that references data not on the page

### Technical
- [ ] Pages are server components (not `'use client'`) — Next.js App Router serves them as static HTML, which is crawlable
- [ ] No `noindex` meta tags on public reference pages
- [ ] Images have `alt` text that describes the content (not just the file name)
- [ ] Internal links use `<Link>` from `next/link`, not raw `<a>` tags

### Content
- [ ] Page titles and headings use terms players actually search for (e.g., "Last Z" not just "game")
- [ ] Each page answers a clear question a player would search

## Output format

For each failed check, report:
1. File path and line number
2. What is wrong
3. The exact fix (show the corrected code snippet)

Do not rewrite files — report the fixes. Apply them only if the user confirms.
