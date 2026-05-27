Set up or audit analytics for the WarGuard web app.

Mode (optional): $ARGUMENTS
- `audit` — check what's currently instrumented and report gaps
- `setup` — scaffold GA4 + custom events (default if no argument)
- `events` — audit custom event coverage only

---

## Step 1 — Check current state

Read `web/package.json` for analytics dependencies.
Read `web/app/layout.tsx` for any existing analytics scripts or providers.

Report: what (if anything) is already instrumented.

---

## Step 2 — Provider

This project uses **Google Analytics 4** via `@next/third-parties/google`.

- Package: `@next/third-parties` (official Next.js integration)
- Page views tracked automatically
- Custom events via `sendGAEvent` from `@next/third-parties/google`
- Requires `NEXT_PUBLIC_GA_ID` env var (GA4 measurement ID, format: `G-XXXXXXXXXX`)
- Compatible with `output: 'export'` (static export)

---

## Step 3 — Setup (if mode is `setup` or default)

### 3a — Install package

```bash
cd web && npm install @next/third-parties
```

### 3b — Add to layout.tsx

In `web/app/layout.tsx`, import and add before `</body>`:

```tsx
import { GoogleAnalytics } from "@next/third-parties/google";

// Inside <body>, before </body>:
{process.env.NEXT_PUBLIC_GA_ID && (
  <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
)}
```

No `'use client'` needed on layout.tsx — GoogleAnalytics self-contains it.

### 3c — Custom events

Import `sendGAEvent` in any client component:

```tsx
import { sendGAEvent } from "@next/third-parties/google";

// Fire on user action:
sendGAEvent("event", "calculator_used", { type: "hq_upgrade" });
```

`sendGAEvent` can be called from `'use client'` components or inside event handlers.

---

## Step 4 — Custom event coverage

Already instrumented in this project:

| Component | File | Event |
|-----------|------|-------|
| HeroesClient | `web/app/heroes/HeroesClient.tsx` | `filter_faction`, `sort_heroes` |
| HeroDetailClient | `web/app/heroes/[id]/HeroDetailClient.tsx` | `view_hero` (useEffect on mount) |
| EventsClient | `web/app/events/EventsClient.tsx` | `select_timezone` |
| ResearchTreeClient | `web/app/research/[tree]/ResearchTreeClient.tsx` | `research_node_toggle`, `research_progress_reset` |
| HQTable | `web/app/hq/HQTable.tsx` | `hq_search` |

Gaps to consider:

### Calculator (`/calc`)
- `sendGAEvent("event", "calc_run", { calculator: "hq" | "research" | ... })` — on each calculate button click

### Nav / search
- Only if nav is a client component with click handlers

For each gap:
- [ ] Confirm the component is already `'use client'` (required for sendGAEvent)
- [ ] If server component, check if a small client wrapper is warranted

---

## Step 5 — Environment variables

Ensure `NEXT_PUBLIC_GA_ID` is set:
- In `.env.local` for local dev (not committed): `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`
- In Vercel project settings under Environment Variables for production

---

## Output

### If `audit` mode:
- List what is instrumented vs. missing
- Rate coverage: High / Medium / Low
- Prioritized list of missing events with exact `sendGAEvent` call

### If `setup` or default mode:
- Show exact code changes for layout.tsx
- List which components need `sendGAEvent` calls added
- Show the exact call for each (don't apply — confirm first)

Do not write files without confirmation. Show all code changes first.
