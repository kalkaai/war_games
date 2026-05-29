Audit and fix responsive layout issues in the GAMIDES web app across mobile, tablet, and desktop.

Target page or component (optional): $ARGUMENTS

If no target is specified, audit all pages in `web/app/` and shared layout in `web/app/layout.tsx`.

---

## Step 1 — Read the target files

Read the target page(s) and `web/app/layout.tsx`. Identify:
- All Tailwind breakpoint classes in use (`sm:`, `md:`, `lg:`, `xl:`)
- Any fixed widths (`w-[Npx]`, `min-w-[Npx]`) that could break on small screens
- Tables, grids, and flex containers that may overflow on mobile
- Font sizes that may be too small on mobile (`text-xs` on body copy)

---

## Step 2 — Breakpoint coverage check

For each layout region (header, nav, content, tables, cards, footer):
- [ ] Has at least one responsive variant (`sm:` / `md:` / `lg:`) if it changes layout at different widths
- [ ] No fixed pixel widths that would overflow a 375px (iPhone SE) viewport
- [ ] No `overflow-hidden` on a parent that clips content the user needs to scroll

Breakpoint targets for this project:
| Breakpoint | Width | Target device |
|---|---|---|
| default (mobile-first) | 0–639px | iPhone SE, small Android |
| `sm:` | 640px+ | large phones, small tablets |
| `md:` | 768px+ | iPad portrait, large tablets |
| `lg:` | 1024px+ | iPad landscape, small laptops |
| `xl:` | 1280px+ | desktop |

---

## Step 3 — Table responsiveness

Data tables (HQ levels, research nodes, gear tiers) are the highest-risk element on small screens.

For each `<table>` or table-like component:
- [ ] Wrapped in a `div` with `overflow-x-auto` so it scrolls horizontally on mobile rather than breaking the layout
- [ ] `<table>` has `min-w-full` or a `min-w-[Npx]` to prevent column collapse
- [ ] Column headers are not so wide they force the table to overflow the page without a scroll wrapper
- [ ] On mobile (`< sm`), consider hiding lower-priority columns with `hidden sm:table-cell`

---

## Step 4 — Touch targets

- [ ] All `<button>`, `<a>`, and interactive elements have a minimum tap area of 44×44px (Apple HIG / WCAG 2.5.5)
  - Use `min-h-[44px] min-w-[44px]` or `p-3` padding on small interactive elements
- [ ] No two interactive elements so close together they can be accidentally tapped simultaneously
- [ ] Filter/sort controls on HeroesClient and ResearchTreeClient are usable with a thumb

---

## Step 5 — Typography scaling

- [ ] Body text is at least `text-sm` (14px) on mobile — never `text-xs` for content users need to read
- [ ] Headings scale down gracefully: `text-2xl sm:text-3xl lg:text-4xl` pattern, not fixed large sizes
- [ ] Long strings (hero names, research node names) have `break-words` or `truncate` to prevent overflow

---

## Step 6 — iOS Safari and Android Chrome gotchas

- [ ] No `100vw` widths that ignore the scrollbar width — use `w-full` instead
- [ ] No `position: fixed` elements that overlap the bottom safe area on iPhone (use `pb-safe` or `padding-bottom: env(safe-area-inset-bottom)` if needed)
- [ ] Input elements (`<input>`, `<select>`) are at least 16px font size — iOS auto-zooms on inputs smaller than 16px (`text-base` minimum)
- [ ] No `-webkit-tap-highlight-color` issues — interactive elements should not flash an ugly highlight on tap
- [ ] The starfield animation in `layout.tsx` uses `pointer-events-none` so it never blocks taps

---

## Step 7 — Navigation

- [ ] Primary nav is usable on mobile (collapses to hamburger, or scrolls horizontally, or fits on one line with reduced padding)
- [ ] Active page is visually indicated on mobile as well as desktop
- [ ] Logo/brand link target is at least 44px tall

---

## Step 8 — Agent-assisted audit (optional, for full-site runs)

If auditing all pages, launch two Explore agents in parallel:

**Agent 1:** "Read every `page.tsx` and `*Client.tsx` in `web/app/`. For each file list: (1) all Tailwind breakpoint classes used, (2) any fixed pixel widths, (3) any table or grid components, (4) any `overflow-hidden` on containers that hold data tables. Report file path and line number for each finding."

**Agent 2:** "Read `web/app/layout.tsx` and `web/app/globals.css`. Check: (1) the header/nav is responsive, (2) the starfield div has `pointer-events-none`, (3) no global styles set `overflow: hidden` on `html` or `body`, (4) the base font size is at least 16px."

---

## Output format

For each failed check:
1. File path and line number
2. What is wrong (e.g., "table not wrapped in overflow-x-auto", "button tap target 24×24px")
3. The exact Tailwind fix (corrected JSX snippet)

Prioritize: table overflow → missing scroll wrappers → tap target size → fixed widths → typography → iOS Safari issues.

Do not rewrite files — report fixes and apply only if the user confirms.
