Audit the WarGuard web app for Answer Engine Optimization (AEO) — readiness to be cited by AI search engines (Perplexity, ChatGPT Search, Google AI Overviews, Grok, etc.).

Page to audit (optional): $ARGUMENTS

If no page is specified, audit all pages in `web/app/`.

## What AEO means for this site

AI answer engines extract facts directly from page content. They prefer:
- Direct, specific answers near the top of the page
- Tabular data with clear column headers
- Questions used as headings (H2/H3)
- Factual, numeric data (costs, durations, levels) — not vague descriptions
- Clear entity context ("Last Z game", not just "the game")

WarGuard's reference data (HQ costs, research badges, hero skills) is exactly what AI engines want to cite. This audit ensures the content is structured to be extracted correctly.

---

## Check 1 — Direct answers above the fold

For each page:
- [ ] The first paragraph or first table answers the core question for that page without requiring scrolling
- [ ] No lengthy intro paragraphs that bury the actual data
- [ ] Example: `/hq` should show the upgrade table immediately, not a 3-paragraph intro

## Check 2 — Question-format headings

- [ ] Major section headings are phrased as questions players actually ask
  - Good: "How much does HQ Level 20 cost?" / "What does Magnetic Storm Shield do?"
  - Bad: "HQ Upgrade Details" / "Key Upgrades"
- [ ] At least one H2 per page is a natural-language question
- [ ] Heading questions match how players would phrase them in ChatGPT or Perplexity

## Check 3 — Entity clarity

- [ ] Every page includes "Last Z" in the H1 or within the first 100 words
- [ ] Game-specific terms are not assumed — brief context given on first use
  - Example: "Apocalypse Time (AT) — the game's timezone, UTC-2" on first mention
- [ ] The site name "WarGuard" appears in the page title

## Check 4 — Table structure

For each data table (HQ levels, research nodes, hero stats, gear tiers):
- [ ] `<table>` element used (not a CSS grid of divs) — AI engines parse `<table>` reliably
- [ ] `<thead>` with `<th>` column headers present and descriptive
  - Good: "Wrench Cost", "Blueprint Cost", "HQ Level Required"
  - Bad: "Cost", "Req."
- [ ] No merged cells (`colspan`/`rowspan`) that break AI extraction
- [ ] Units are in column headers or cell values, not assumed ("150K wrenches" not "150")

## Check 5 — FAQ / Q&A blocks

- [ ] Pages with multiple distinct questions (HQ, research, heroes) have an explicit FAQ section at the bottom
- [ ] FAQ uses `<details>`/`<summary>` or visible Q&A pairs — not hidden behind tabs
- [ ] FAQPage JSON-LD structured data is present on pages with FAQ content (check `<script type="application/ld+json">`)

## Check 6 — Factual density

- [ ] Pages favor specific numbers over adjectives
  - Good: "Destroyer EX requires 35,000+ wrenches to unlock"
  - Bad: "Destroyer EX is the most expensive vehicle"
- [ ] No content that says "varies" or "depends" without giving the actual range
- [ ] Data matches the JSON source files — no stale content from outdated data

## Check 7 — Citation signals

- [ ] Data source noted somewhere on the page or in a footer note (e.g., "Data sourced from lastz.stresswar.com")
- [ ] Last-updated date present on pages with frequently changing data (events schedule, patch-sensitive values)

## Check 8 — robots.txt / sitemap

- [ ] `web/public/robots.txt` exists and does NOT block major AI crawlers:
  - `GPTBot`, `PerplexityBot`, `ClaudeBot`, `anthropic-ai`, `Google-Extended`
- [ ] `web/public/sitemap.xml` exists and lists all public reference pages
- [ ] Sitemap is referenced in `robots.txt`

---

## Output format

For each failed check:
1. File path and line number (or `robots.txt` / `sitemap.xml` if missing)
2. What is wrong
3. The exact fix — show corrected code or content snippet

Do not rewrite files. Report fixes and apply only if the user confirms.

Prioritize: missing entity context → question headings → table structure → FAQ schema → robots.txt.
