Parse a Last Z: Survival Shooter game patch and update the affected data files.

Patch notes or description: $ARGUMENTS

## Step 1 — Parse the patch

Read the patch notes provided (or fetch the URL if a link was given). Extract:
- Changed game values (costs, durations, requirements, stat values)
- New content added (new HQ levels, new research nodes, new heroes)
- Removed or renamed content
- Any mechanic changes that affect how data is displayed

List each change as: `[CHANGE TYPE] [ENTITY] — [OLD VALUE] → [NEW VALUE]`

Example:
```
[COST CHANGE] HQ Level 35 food cost — 50,000,000 → 45,000,000
[NEW CONTENT] Research tree: Combat — new node "Advanced Tactics" at level 8
[RENAME] Hero "Zara" → "Zara the Relentless"
```

## Step 2 — Map changes to data files

For each change identified, determine which file in `web/data/` needs updating:

| Change type | File |
|---|---|
| HQ level costs/requirements | `hq.json` |
| Research nodes/costs | `research.json` |
| Hero stats/abilities | `heroes.json` |
| Tank stats | `tanks.json` |
| Event schedule/timing | `events.json` |

Read the affected files to understand the current values before making changes.

## Step 3 — Validate the patch notes

Before making any edits:
- Cross-check changed values against at least one external source (stresswar.com or the Last Z: Survival Shooter wiki)
- Flag any change that seems inconsistent with the surrounding data (e.g., a cost that breaks the scaling pattern of adjacent levels)
- If a value is unverified, mark it with a comment `// UNVERIFIED — patch note only` in a separate tracking note (not in the JSON itself)

## Step 4 — Apply changes

Make the minimum edits needed to reflect the patch:
- Change only the fields that actually changed
- Do not reformat or reorder other entries
- For new content, add entries following the exact same structure as existing entries

After editing, verify the file is valid JSON and still matches `web/types/index.ts`.

## Step 5 — Summary

Output a diff summary:
- Files changed
- Specific fields modified (old value → new value)
- Any new entries added
- Any unverified values that need manual confirmation

Suggest a commit message following the project's commit style.
