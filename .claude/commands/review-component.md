Review a component or page for WarGuard web project conventions.

File to review: $ARGUMENTS

Read the file, then check each of the following. Report pass/fail/fix for each item.

## Next.js App Router
- [ ] Is `'use client'` only present if the component uses `useState`, `useEffect`, `useRef`, event handlers, or browser APIs?
- [ ] Are server components fetching data directly (import JSON) rather than via `useEffect` + fetch?
- [ ] Are there any `getServerSideProps` or `getStaticProps` patterns (wrong paradigm for App Router)?

## Data
- [ ] Are all game values (costs, levels, stats, timers) sourced from `/data/*.json` — nothing hardcoded inline?
- [ ] Is the JSON import typed against the interface in `web/types/index.ts`?
- [ ] Are resource numbers stored as raw integers, with formatting applied in the component?

## Styling
- [ ] Tailwind CSS only — no inline styles, no CSS modules, no styled-components?
- [ ] Dark gaming theme used consistently (bg-[#0a0014] base, purple-900/50 cards)?
- [ ] Mobile responsive (sm:/md:/lg: breakpoints present where layout changes)?

## Code quality
- [ ] No helper functions or utilities created for a single use case?
- [ ] No abstraction layers between the component and its data that serve no purpose?
- [ ] No comments that just describe what the code does (only comments for non-obvious logic)?
- [ ] Types from `web/types/index.ts` used — no re-defined equivalent interfaces?

## Output
For each failed check, provide the specific fix. Do not rewrite the whole file — only change what fails.
