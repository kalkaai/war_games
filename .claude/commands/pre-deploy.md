Run the pre-deployment checklist for the GAMIDES web app.

Environment: $ARGUMENTS (e.g., "staging" or "production" — defaults to production if not specified)

Do not deploy until every check passes. Fix blockers before proceeding.

## Step 1 — Build check

Run `cd web && npm run build`. Report:
- Build success or failure
- Any TypeScript errors
- Any ESLint errors that block the build
- Bundle size warnings (flag any route > 500KB first load JS)

Fix all build errors before continuing.

## Step 2 — Data file integrity

Read every file in `web/data/`. For each:
- [ ] Valid JSON (parseable without error)
- [ ] Not empty (`{}` or `[]` counts as empty)
- [ ] Matches the TypeScript interface in `web/types/index.ts`
- [ ] No placeholder values (strings like "TODO", "TBD", 0 where a real value is expected)

## Step 3 — Environment variables

Check `web/.env.example` (or `web/next.config.ts` for public env vars):
- [ ] `ANTHROPIC_API_KEY` is NOT hardcoded anywhere in `web/` (grep for `sk-ant-`)
- [ ] All `NEXT_PUBLIC_` vars that are used in code are defined
- [ ] Phase 4 routes (`web/app/api/ai/`) are not accessible if `ANTHROPIC_API_KEY` is not set in the deployment environment

## Step 4 — SEO check (abbreviated)

Run `/seo-audit` mentally against the pages being deployed:
- [ ] Every page has a unique `<title>`
- [ ] No `noindex` on public pages
- [ ] `og:image` paths exist in `public/`

## Step 5 — Consistency check

- [ ] No `'use client'` directive on pages that only render static data
- [ ] No hardcoded game values in components (all sourced from `/data/*.json`)
- [ ] `web/types/index.ts` is in sync with `discord_bot/src/types/index.ts` (run `/sync-types` to verify)

## Step 6 — Cross-browser spot check (manual — skip in CI)

If deploying to production, manually verify in a browser:
- Events page: timezone converter works
- HQ table: all levels render, no broken cells
- Research trees: node states persist on reload (localStorage)

## Output

List all checks with PASS / FAIL / SKIP status. For any FAIL, provide the specific fix.

Do not proceed with deployment if any FAIL is present in Steps 1–5.
