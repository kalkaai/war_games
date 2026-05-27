Extract and populate a game data JSON file for the WarGuard web app.

Target file: $ARGUMENTS

This command handles the highest-friction task in the project — getting accurate game data from external sources into the correct JSON schema.

## Step 1 — Read the existing schema

Read `web/data/$ARGUMENTS` and `web/types/index.ts` to understand:
- The exact JSON structure expected
- The TypeScript interface it must conform to
- Any fields already populated

If the file is empty or missing, run `/data-schema $ARGUMENTS` first and wait for the schema to be defined before proceeding.

## Step 2 — Identify source pages

Based on the file name, determine which pages to fetch:

| File | Primary source |
|---|---|
| `hq.json` | https://lastz.stresswar.com/hq |
| `research.json` | https://lastz.stresswar.com/research |
| `heroes.json` | https://lastz.stresswar.com/heroes |
| `events.json` | https://lastz.stresswar.com/schedule |
| `tanks.json` | https://lastz.stresswar.com/tanks |

Fetch the primary source page first. If data is incomplete, also check:
- https://lastz.stresswar.com (general reference)
- The Last Z wiki if linked from the source page

## Step 3 — Extract data

From the fetched page, extract every data field that maps to the schema:
- List every row/entry found
- Note any fields that are missing or ambiguous
- Flag values that seem inconsistent (e.g., costs that don't scale linearly)

## Step 4 — Validate completeness

Cross-check extracted data against the schema:
- Are all required fields populated for every entry?
- Do numeric values look reasonable (no obvious copy-paste errors)?
- Are enum values (like tree names, hero types) consistent with `web/types/index.ts`?

## Step 5 — Write the file

Write the populated JSON to `web/data/$ARGUMENTS`.

Format rules:
- 2-space indentation
- Numbers as raw integers (no formatted strings like "1,200")
- Durations in seconds (not human-readable strings)
- Consistent key ordering across all entries (match schema field order)

## Step 6 — Verify TypeScript compliance

After writing, confirm:
- The JSON structure matches the TypeScript interface exactly
- No extra fields present that aren't in the interface
- No required fields missing

If any issues are found, fix them before finishing. Do not leave the file in a broken state.
