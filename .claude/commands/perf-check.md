Check performance and bundle size for the GAMIDES web app.

Page or component to check (optional): $ARGUMENTS

If no target is specified, check the whole `web/` project.

## Step 1 — Build and measure

Run `cd web && npm run build`. From the build output, record:
- First Load JS size for each route
- Any routes flagged as large (Next.js warns at 500KB)
- Shared chunks size

Flag any route with First Load JS > 300KB for investigation.

## Step 2 — Client JS audit

Read every file in `web/app/` and `web/components/`. For each `'use client'` directive found:
- [ ] Is it actually needed? (Uses `useState`, `useEffect`, `useRef`, event handlers, or browser APIs)
- [ ] Could the data-fetching logic be moved to a parent server component, keeping only the interactive part as a client component?

Every unnecessary `'use client'` increases the client bundle. Reference table pages (HQ, research list view) should be server components.

## Step 3 — Image optimization

Read all image usage in `web/app/` and `web/components/`:
- [ ] Images use `next/image` (`<Image>`) not raw `<img>` tags
- [ ] `width` and `height` are specified on all `<Image>` components (prevents layout shift)
- [ ] Hero images or large banners specify `priority` prop (prevents render-blocking LCP)
- [ ] No images loaded from external domains unless listed in `next.config.ts` `images.remotePatterns`

## Step 4 — Data import size

For each page that imports from `web/data/`:
- [ ] The page only imports the data it needs — not the entire file if only a subset is used
- [ ] Large data files (> 100KB) are imported in server components so they don't ship to the client

## Step 5 — Rendering strategy

For each page in `web/app/`:
- [ ] Static reference pages (HQ, research, heroes, events schedule) are statically generated — no `dynamic = 'force-dynamic'` unless justified
- [ ] The events page (timezone converter) can have a server component for static content + a client component for the interactive timezone UI

## Output

For each issue found:
1. File path
2. What the problem is
3. The fix (show code snippet if applicable)

Prioritize: unnecessary `'use client'` directives → large client bundles → missing image optimization → suboptimal data imports.
