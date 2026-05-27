Set up or audit Google Ads (AdWords) integration for the WarGuard web app.

Task (optional): $ARGUMENTS

If no task is specified, run a full audit of the current ads setup and recommend next steps.

## Context

WarGuard is a static Next.js site (`output: 'export'`). Google Ads integration is done via:
- **Google Ads tag (gtag.js)** — loads via `<Script>` in `app/layout.tsx`
- **Conversion tracking** — fires on specific user actions (Discord click, page views)
- **Remarketing** — optional, tags visitors for retargeting campaigns

The site has NO server-side rendering in Phase 1–3. All tracking must work client-side.

---

## Task: Setup — Add Google Ads tag

1. Add the Ads conversion ID to `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
   ```

2. Add `<Script>` tags to `app/layout.tsx` (after the `<body>` open tag, before content):
   ```tsx
   import Script from 'next/script'

   // In layout body:
   <Script
     src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}`}
     strategy="afterInteractive"
   />
   <Script id="google-ads-init" strategy="afterInteractive">
     {`
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}');
     `}
   </Script>
   ```

3. Do NOT use `strategy="beforeInteractive"` — it blocks page load. Always use `"afterInteractive"`.

---

## Task: Conversion tracking — Discord invite click

The primary conversion action is clicking the Discord invite link.

1. Create a client component `components/DiscordInviteLink.tsx` (`'use client'`):
   ```tsx
   'use client'
   declare function gtag(...args: unknown[]): void

   export function DiscordInviteLink({ children, className }: { children: React.ReactNode; className?: string }) {
     const url = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL!

     function handleClick() {
       if (typeof gtag !== 'undefined') {
         gtag('event', 'conversion', {
           send_to: `${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/CONVERSION_LABEL`,
         })
       }
     }

     return (
       <a href={url} target="_blank" rel="noopener noreferrer" className={className} onClick={handleClick}>
         {children}
       </a>
     )
   }
   ```

2. Replace plain `<a>` Discord invite links in `app/page.tsx` (and other pages) with `<DiscordInviteLink>`.

3. Add the conversion label to `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=xxxxxxxxxxxx
   ```

---

## Task: Audit — Check current setup

### Script loading
- [ ] `gtag.js` script is present in `app/layout.tsx`
- [ ] Script uses `strategy="afterInteractive"` (NOT `"beforeInteractive"` or inline in `<head>`)
- [ ] `NEXT_PUBLIC_GOOGLE_ADS_ID` env var is defined and used — not hardcoded

### Conversion events
- [ ] Discord invite click fires a conversion event
- [ ] `gtag` is called only after the script has loaded (guard with `typeof gtag !== 'undefined'`)
- [ ] No conversion events fire on page load (only on explicit user actions)

### Privacy / compliance
- [ ] No PII (email, username, user ID) is passed in gtag event parameters
- [ ] A cookie consent banner is present if targeting EU users (GDPR)
- [ ] `robots.txt` does NOT block Googlebot (required for ad quality score)

### Landing page quality (affects ad rank)
- [ ] The landing page (`/`) has a clear, single call-to-action
- [ ] Page load is fast — run `/perf-check` and resolve any LCP > 2.5s issues
- [ ] The page content matches the ad keywords (relevance score)
- [ ] No interstitials or pop-ups that block content immediately on load

### Campaign keywords to target (suggestions for Last Z niche)
- `last z game guide`
- `last z hq upgrade cost`
- `last z research tree`
- `last z war game tips`
- `last z discord`
- Negative keywords: `last z download`, `last z apk` (not the right intent)

---

## Output format

For **setup tasks**: write the code, show the diff, ask for confirmation before applying.

For **audits**: list each failed check with file path, what is wrong, and the exact fix. Do not apply without confirmation.
