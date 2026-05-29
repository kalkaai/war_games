Run the full feature workflow for the GAMIDES web app.

Feature to build: $ARGUMENTS

This command orchestrates the complete 8-step process. Do not skip steps.

## Step 1 — Compact
Remind the user to run `/compact` if this is not the first message in the session. Stale context from previous features causes inconsistencies.

## Step 2 — Explore (parallel agents)
Launch two Explore agents simultaneously:
1. Explore the existing `web/` structure relevant to this feature — components, pages, data files, types
2. Explore any related patterns in `discord_bot/src/` that this feature should stay consistent with (types, data structures)

## Step 3 — Schema first (if data is involved)
If this feature reads game data:
- Identify the data file it needs
- If the file is empty or missing, run `/data-schema [filename]` before proceeding
- Do NOT build any component until the data file is confirmed populated

## Step 4 — Plan
Use a Plan agent to design the implementation:
- Which files will be created or modified
- Component breakdown (server vs client)
- Any state management needed
- How localStorage will be used (if applicable)
- Potential edge cases

Present the plan and wait for approval before writing code.

## Step 5 — Implement
Build the feature following the approved plan:
- Server components by default
- Tailwind CSS only, dark gaming theme
- All game values from /data/*.json — never hardcoded
- No abstractions created for one-time use
- TypeScript strict — use existing types from web/types/index.ts

## Step 6 — Simplify
After implementation is working, run a review pass:
- Remove any 'use client' on components that only render static data
- Remove any helper functions used exactly once
- Remove any error handling for scenarios that cannot occur with static JSON
- Remove any comments that just describe what the code does

## Step 7 — Save to memory
For any non-obvious patterns or gotchas discovered during implementation, save them:
> "Remember: [discovery]"

## Step 8 — Commit prompt
Output a suggested commit message following the existing commit style in the repo. Do not commit automatically — present the message and wait for user confirmation.
