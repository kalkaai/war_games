Launch the standard GAMIDES web agent suite for the task described.

Task: $ARGUMENTS

Based on the task, launch the appropriate combination of agents in parallel. Choose from the patterns below.

---

## Pattern A — Before building any page

Launch in parallel:

**Agent 1 (Explore):** "Explore web/app/ and web/components/ — describe the existing page structure, component naming conventions, and how data is imported. List all existing pages and what data file each uses."

**Agent 2 (Explore):** "Fetch https://lastz.stresswar.com and identify which section of the site is most relevant to [task]. Describe the layout, data displayed, and any interactive elements."

---

## Pattern B — Before a multi-file feature

Launch in parallel:

**Agent 1 (Explore):** "Explore web/ and identify all files that will be affected by [task]. List them with a one-line description of what would change in each."

**Agent 2 (Explore):** "Read discord_bot/src/types/index.ts and discord_bot/src/data/gamePresets.json. Describe the data structures and types that the web app should reuse for [task]."

Then launch sequentially:

**Agent 3 (Plan):** "Design the implementation for [task] in the GAMIDES Next.js web app. Context from exploration: [paste Agent 1 + 2 results]. Identify: which files to create/modify, server vs client component decisions, data flow, and any risks."

---

## Pattern C — Before the AI chat feature (Phase 4)

Launch in parallel:

**Agent 1 (Explore):** "Read web/app/api/ and web/lib/ — describe the existing API route structure and any utility patterns in place."

**Agent 2 (Explore):** "Read discord_bot/src/data/ — list all JSON data files and summarize their structure. These will be used as tool-accessible game data in the Claude API routes."

**Agent 3 (Plan, background):** "Plan the Claude API chat route for the GAMIDES web app: streaming via ReadableStream, tool use for HQ and research lookups from static JSON, prompt caching on the system prompt, claude-opus-4-6 with adaptive thinking. Context: Next.js 14 App Router, TypeScript, static game data in /data/*.json."

---

## Pattern D — Data schema research

Launch in parallel:

**Agent 1 (Explore):** "Fetch https://lastz.stresswar.com/[section] and extract all the data fields displayed. List every piece of data shown on the page with its label and data type."

**Agent 2 (Explore):** "Read web/data/ and web/types/index.ts. Describe the existing JSON schema patterns and TypeScript interface conventions used in the project."

---

## Pattern E — Pre-commit review

Launch in parallel:

**Agent 1 (Explore):** "Read all files changed in this session (list them from context). Check each for: hardcoded game values, unnecessary 'use client' directives, one-off utility functions, and missing TypeScript types."

**Agent 2 (Explore):** "Read web/types/index.ts and discord_bot/src/types/index.ts. Check if any new types added to the web app duplicate or conflict with types already defined in the bot."

---

## Pattern F — Game data extraction from multiple sources

Use when populating a data file that may have incomplete or conflicting information across sources.

Launch in parallel:

**Agent 1 (Explore):** "Fetch https://lastz.stresswar.com/[section] — extract every data point visible on the page. List each entry with all its fields and values exactly as shown."

**Agent 2 (Explore):** "Fetch https://lastz.fandom.com/wiki/[topic] (or the relevant wiki page for [topic]). Extract the same data fields. Note any values that differ from stresswar.com."

Then launch sequentially:

**Agent 3 (Explore):** "Read web/data/[file].json and web/types/index.ts. Given the data extracted from Agent 1 and Agent 2 results: [paste results], identify any discrepancies between sources, flag unverified values, and produce the final merged JSON that matches the TypeScript interface."

---

## Pattern G — Runtime debugging

Use when a page or component is broken and the root cause is unclear.

Launch in parallel:

**Agent 1 (Explore):** "Read [broken component or route file]. Trace the data flow from source (JSON import or API call) to render output. Identify the exact line where the value diverges from what's expected."

**Agent 2 (Explore):** "Read web/data/[relevant file].json and web/types/index.ts. Check if the JSON structure matches the TypeScript interface exactly. List any mismatches (missing fields, wrong types, extra fields the interface doesn't account for)."

Then launch sequentially:

**Agent 3 (Explore):** "Given the findings from Agent 1 [paste] and Agent 2 [paste], identify the root cause of [bug description] and provide the minimal fix."

---

## Pattern H — Full site quality audit (SEO + AEO + Performance + Analytics)

Use before a deployment or after adding several new pages. Run all four audits in parallel.

Launch in parallel:

**Agent 1 (Explore) — SEO:** "Read every page in web/app/ (all page.tsx files). For each page check: (1) export const metadata has title + description, (2) title is unique and includes 'Last Z', (3) description is 120–160 chars, (4) og:title + og:description + og:image present, (5) canonical URL set, (6) exactly one H1 per page, (7) H1 includes the primary keyword. Report every failure with file path, line number, and the corrected code snippet."

**Agent 2 (Explore) — AEO:** "Read every page in web/app/ (all page.tsx files). For each page check: (1) 'Last Z' appears in H1 or first 100 words, (2) at least one H2 is phrased as a question, (3) data tables use <table>/<thead>/<th> not CSS grid divs, (4) column headers include units, (5) specific numbers used not vague adjectives, (6) FAQPage JSON-LD present on pages with FAQ sections. Also check web/public/robots.txt — confirm GPTBot, PerplexityBot, ClaudeBot, anthropic-ai are NOT blocked. Report every failure with file path and exact fix."

**Agent 3 (Explore) — Performance:** "Read every file in web/app/ and web/components/. For each 'use client' directive found, verify it is actually needed (uses useState/useEffect/useRef/event handlers/browser APIs). List any unnecessary 'use client' directives. Also check: all images use next/image not raw img tags, width+height set on all Image components, large data imports (>100KB) are in server components not client components. Report file path, issue, and fix for each problem."

**Agent 4 (Explore) — Analytics:** "Read web/package.json and web/app/layout.tsx. Check if @next/third-parties is installed and GoogleAnalytics is wired into layout.tsx with NEXT_PUBLIC_GA_ID. Then read web/app/calc/CalcClient.tsx, web/app/heroes/HeroesClient.tsx, web/app/heroes/[id]/HeroDetailClient.tsx, web/app/events/EventsClient.tsx, web/app/research/[tree]/ResearchTreeClient.tsx, and web/app/hq/HQTable.tsx. Check if sendGAEvent() from @next/third-parties/google is called on key user interactions. Report: what is instrumented, what is missing, and the exact sendGAEvent() call needed for each gap."

After all four complete, summarize the findings by priority:
1. Blocking issues (missing metadata, broken tables, unnecessary client bundles)
2. High-value quick fixes (question headings, track() calls, robots.txt)
3. Nice-to-have (FAQ schema, source attribution, Speed Insights)

---

## Pattern I — Responsive audit (multi-platform)

Use when adding new pages or before a production release to verify layout works across mobile, tablet, and desktop.

Launch in parallel:

**Agent 1 (Explore) — Layout & tables:** "Read every page.tsx and *Client.tsx in web/app/. For each file list: (1) all Tailwind breakpoint classes used (sm:/md:/lg:/xl:), (2) any fixed pixel widths (w-[Npx], min-w-[Npx]) that could overflow a 375px viewport, (3) any <table> or grid component NOT wrapped in a div with overflow-x-auto, (4) any overflow-hidden on a container that holds a data table. Report file path and line number for every finding."

**Agent 2 (Explore) — Touch targets & typography:** "Read every interactive component in web/app/ (buttons, links, inputs, selects, filter controls). For each: (1) check tap target is at least 44×44px — flag anything with h-6/w-6 or smaller without sufficient padding, (2) check body/label text is text-sm or larger (never text-xs for readable content), (3) check all <input> and <select> elements have text-base or larger (iOS zooms on <16px inputs), (4) check heading sizes use responsive variants not fixed large sizes. Report file path and line number."

**Agent 3 (Explore) — Navigation & iOS Safari:** "Read web/app/layout.tsx and web/app/globals.css. Check: (1) the header/nav is usable on mobile (collapses, scrolls, or fits at 375px width), (2) the starfield div has pointer-events-none, (3) no global overflow: hidden on html or body that would break scroll, (4) no position: fixed elements overlapping iPhone bottom safe area without env(safe-area-inset-bottom), (5) no 100vw widths — should be w-full. Report any failures with exact fix."

After all three complete, summarize by priority:
1. Breaking issues (table overflow, fixed widths clipping content, nav unusable on mobile)
2. Usability issues (small tap targets, iOS zoom on inputs)
3. Polish (heading scale, safe-area padding)
