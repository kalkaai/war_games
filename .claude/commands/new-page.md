Build a new reference page for the WarGuard web app.

Page to build: $ARGUMENTS

Follow this exact sequence:

## Step 1 — Explore (parallel)
Launch two Explore agents simultaneously:
1. Read `web/app/` to understand the existing page structure, layout, and component conventions
2. Read `web/data/` to identify which data file this page will use and its current schema

## Step 2 — Schema check
Before writing any component:
- If the data file for this page exists and is populated, confirm its schema matches what the page needs
- If the data file is empty or missing, STOP and output the exact JSON schema the file should use. Ask the user to populate it before continuing.

## Step 3 — Build the page
Once schema is confirmed:
- Create the page as a **server component** (no 'use client' unless interactivity is required)
- Read game data from the JSON file in `/data/` using a direct import — no API route, no fetch
- Use Tailwind CSS only — dark gaming theme (bg-[#0a0014] base, purple-900/50 for cards)
- Match the component patterns from the existing pages (naming, prop types, export style)
- Mobile responsive

## Step 4 — Validate
After building:
- Confirm no `'use client'` directives on components that only render static data
- Confirm no inline game data values (all from JSON file)
- Confirm no new abstractions created for one-time use
- Run `/simplify` on the finished page
