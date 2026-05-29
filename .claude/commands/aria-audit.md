Audit the GAMIDES web app for ARIA accessibility compliance.

Page to audit (optional): $ARGUMENTS

If no page is specified, audit all pages and components in `web/app/` and `web/components/`.

## What to check

### Interactive elements
- [ ] Every `<button>` has either visible text OR `aria-label` / `aria-labelledby`
- [ ] Icon-only buttons have `aria-label` that describes the action (e.g., `aria-label="Close menu"`)
- [ ] `<a>` tags with no visible text (icon links) have `aria-label`
- [ ] No `<div onClick>` or `<span onClick>` — use semantic `<button>` instead

### Form inputs
- [ ] Every `<input>`, `<select>`, `<textarea>` has an associated `<label>` (via `htmlFor` / `id` pair) OR `aria-label` / `aria-labelledby`
- [ ] Error messages are linked to their input via `aria-describedby`
- [ ] Required fields have `aria-required="true"` or the `required` attribute

### Images
- [ ] Decorative images have `alt=""` (empty string, not omitted)
- [ ] Informative images have `alt` text that conveys the meaning — not just the file name
- [ ] `next/image` components always pass an `alt` prop

### Landmark regions
- [ ] Page has exactly one `<main>` element
- [ ] `<nav>` elements have `aria-label` when there are multiple (e.g., `aria-label="Primary"`, `aria-label="Footer"`)
- [ ] `<header>` and `<footer>` are present at the page level (not nested inside `<main>`)

### Tables
- [ ] Data tables use `<table>`, `<thead>`, `<th>` — not CSS grid of divs
- [ ] `<th>` elements have `scope="col"` or `scope="row"` where needed
- [ ] Tables with no visible caption have `aria-label` on the `<table>` element

### Dynamic / interactive components
- [ ] Modals/dialogs have `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing to the title
- [ ] Accordions (shadcn `<Accordion>`) are used as-is — do not override their built-in ARIA
- [ ] Tooltips (shadcn `<Tooltip>`) are triggered by focusable elements — not `<div>` hover
- [ ] Loading states use `aria-live="polite"` or `aria-busy="true"`

### Keyboard navigation
- [ ] All interactive elements are reachable via Tab in a logical order
- [ ] No `tabIndex` values greater than 0 (they break natural tab order)
- [ ] Focus is visible — the global `:focus-visible` outline is not suppressed in `globals.css`
- [ ] Modals trap focus while open and return focus to the trigger on close

### Skip link
- [ ] A skip-to-main-content link exists as the first focusable element in `layout.tsx`
  - Example: `<a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>`
- [ ] `<main>` has `id="main-content"`

### Color and contrast (flag only — do not fix)
- [ ] Text on `bg-purple-900/50` cards meets WCAG AA (4.5:1 for body text)
- [ ] `text-purple-300/70` muted text — flag if used for meaningful content (low contrast risk)

## Output format

For each failed check:
1. File path and line number
2. What is wrong
3. The exact fix (corrected JSX snippet)

Do not rewrite files — report fixes and apply only if the user confirms.

Prioritize: missing labels on interactive elements → images without alt → landmark issues → table headers → keyboard traps.
