Validate a calculator component for mathematical correctness and edge cases.

Calculator to validate: $ARGUMENTS

## Step 1 — Read the component and its data source

Read the calculator component file. Identify:
- What inputs it accepts (types, ranges, defaults)
- What formula it uses to compute the output
- Which JSON file(s) it reads data from (e.g., `web/data/hq.json`)

## Step 2 — Verify the formula

Cross-check the component's math against the known game formula:

**Badge budget calculator:**
- Total badges = sum of (badge cost per level × levels upgraded)
- Validate against at least 3 known HQ levels from `web/data/hq.json`

**Resource planner:**
- Resources needed = current level costs + sum of all intermediate levels to target
- Validate that it accounts for ALL levels between current and target, not just the target level's cost

**Speed-up calculator:**
- Total time reduced = sum of speed-up values in correct units (minutes/hours — check for off-by-one on unit conversion)
- Remaining time = build time − total speed-up (floor to 0, never negative)

For any other calculator, ask: "does the output match what a player would compute manually?"

## Step 3 — Edge case checks

Test these inputs mentally (or by reading the code):

- [ ] Input at minimum value (e.g., current level = 1, target level = 1) — should output 0 or "already at target"
- [ ] Input at maximum value (e.g., HQ level 40 to 40) — should not crash or show NaN
- [ ] Target level lower than current level — should show an error message, not a negative cost
- [ ] Non-integer input on integer fields — component should sanitize or reject
- [ ] Empty input — component should show a placeholder or disable output, not "NaN" or "undefined"

## Step 4 — Formatting checks

- [ ] Large numbers use formatted display (e.g., "1,200,000" not "1200000")
- [ ] Duration outputs use human-readable format (e.g., "2d 4h 30m" not "196200 seconds")
- [ ] Formatting is applied in the component, not stored in the JSON data
- [ ] Zero values display as "0" not "" (empty string)

## Step 5 — Output format

For each failed check:
1. File path and line number
2. What is wrong (incorrect formula, missing edge case, bad formatting)
3. The corrected code snippet

Do not rewrite the entire file — only fix what fails.
