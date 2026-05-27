# WarGuard Web — Developer Guide

## What this is

Next.js 14 App Router game reference site for Last Z players.
No auth, no database — fully static public site for Phase 1–3.
Phase 4 adds a Claude API chat interface; Phase 5+ adds auth.

## Stack

- Next.js 14 App Router, TypeScript strict
- Tailwind CSS + shadcn/ui — no CSS modules, no styled-components, no other CSS libraries
- shadcn components installed via `npx shadcn@latest add <component>` into `components/ui/`
- Static export (`output: 'export'` in next.config.mjs) for Phase 1–3
- All game data in static JSON files — no DB reads on reference pages

## File Conventions

- `app/layout.tsx` — root layout: header, starfield, footer. Always a Server Component.
- `app/page.tsx` — landing page. Server Component.
- `app/[route]/page.tsx` — one file per page. Server Component by default.
- `types/index.ts` — shared TypeScript types. No runtime logic.
- `data/*.json` — game data files. Populate before building the page that reads them.

## Server vs Client Components

Default: **Server Components**. No `'use client'` unless strictly required.

Add `'use client'` only when the component uses:
- `useState`, `useReducer`, `useEffect`, `useRef`
- Browser APIs (`window`, `localStorage`, `navigator`)
- Event handlers in response to user input

Do NOT add `'use client'` to layouts, pages that render static data, or components that only pass props.

## shadcn/ui

- `components.json` configured with `style: "default"`, `baseColor: "violet"`, `cssVariables: true`
- Add components: `npx shadcn@latest add button` (or table, accordion, tooltip, etc.)
- Components install into `components/ui/` — edit them freely, they're yours
- CSS variables in `globals.css :root` map the dark gaming theme to shadcn's token convention
- `<html className="dark">` in layout.tsx activates shadcn's dark: variants
- Use shadcn components for interactive UI (tables, accordions, tooltips, inputs)
- Use raw Tailwind for layout, spacing, and custom game card styles

## Design Tokens

| Token | Value | Tailwind class |
|---|---|---|
| Base background | `#0a0014` | `bg-[#0a0014]` |
| Card background | purple-900/50 | `bg-purple-900/50` |
| Card border | purple-800/50 | `border-purple-800/50` |
| Text primary | white | `text-white` |
| Text secondary | purple-200/80 | `text-purple-200/80` |
| Text muted | purple-300/70 | `text-purple-300/70` |
| CTA button | purple-600 | `bg-purple-600 hover:bg-purple-500` |
| Outline button | purple-700 border | `border-purple-700 hover:border-purple-500` |

Use explicit hex values and Tailwind opacity modifiers. **Never** use `dark:` prefix classes.

## Key Rules

1. All game values (durations, costs, schedules) live in `data/*.json` — never inline in components.
2. Section nav links and card descriptions are static UI, not game data. Inline arrays in page files are fine.
3. No abstractions for one-time use. If a component is used in one place, keep it inline.
4. `next/link` for internal navigation. Plain `<a>` for external links (Discord invite, etc.).
5. Images: use `next/image` with `unoptimized` prop (required for `output: 'export'`).
6. Fonts: use `next/font/local` (Geist already configured in layout.tsx).
7. No extra abstractions — if a helper function is used once, keep it inline.

## Data Files

Populate data files before building the page that reads them. Schema first, component second.

| File | Content | Status |
|---|---|---|
| `data/gamePresets.json` | VS rotation, AP cycle, recurring events | Copy from discord_bot/src/data/gamePresets.json |
| `data/hq.json` | HQ levels 1–40 | Needs populating (Phase 2) |
| `data/research.json` | 9 research trees with nodes | Needs populating (Phase 2) |
| `data/heroes.json` | Hero list with skills | Needs populating (Phase 3) |
| `data/tanks.json` | Tank specs and upgrades | Needs populating (Phase 3) |

## Environment Variables

```
NEXT_PUBLIC_DISCORD_INVITE_URL=   # Full Discord bot invite URL
```

Public env vars (prefixed `NEXT_PUBLIC_`) are embedded at build time. Never commit `.env.local`.

## What NOT to do

- Don't add auth (personal timers stay on the Discord bot)
- Don't add a database layer (Phase 1–3 is fully static)
- Don't use `dark:` Tailwind classes (we manage the dark theme explicitly)
- Don't create shared utility files for one-off operations
- Don't use `'use client'` on components that only render static data
- Don't hardcode game values (timer durations, costs, schedules) in components

## Relationship to discord_bot/

The web app is a standalone project. It does NOT import from `../discord_bot/`.
Shared types are copied into `web/types/index.ts` and adapted for web use
(Firestore `Timestamp` → plain `number` Unix ms).

## Running Locally

```bash
cd web
npm run dev     # starts at http://localhost:3000
npm run build   # static export to out/
```
