Validate the research tree data and interactive component for the GAMIDES web app.

Tree to validate (optional): $ARGUMENTS

If no tree is specified, validate all 9 trees.

## Step 1 — Read the data

Read `web/data/research.json` and `web/types/index.ts`. Understand:
- The structure of each research node (id, name, level, prerequisites, costs)
- The tree names and how nodes are grouped into trees

## Step 2 — Dependency graph validation

For each research tree, check:
- [ ] No circular dependencies (node A requires B, B requires A)
- [ ] All `prerequisites` IDs reference nodes that actually exist in the data
- [ ] Root nodes (no prerequisites) exist in every tree
- [ ] Every non-root node has at least one valid prerequisite
- [ ] Max depth is reasonable (flag any chain longer than 10 levels)

## Step 3 — Data completeness

For every node across all trees:
- [ ] `id` is unique across the entire dataset (not just within a tree)
- [ ] `name` is non-empty
- [ ] Cost arrays (food, wood, iron, etc.) have the same number of entries as `maxLevel`
- [ ] No node has a `maxLevel` of 0
- [ ] No negative costs

## Step 4 — localStorage schema validation

Read `web/components/game/ResearchTreeGrid.tsx` (or equivalent component).

Check the localStorage key and value structure used to persist player progress:
- [ ] The key is a constant (not constructed from user input)
- [ ] The stored value only contains node IDs and level numbers — no full node objects
- [ ] The component handles missing or malformed localStorage data without crashing (try/catch or default fallback)
- [ ] Resetting progress actually clears the correct localStorage key

## Step 5 — UI consistency

Read the research tree components. Check:
- [ ] Locked nodes (prerequisites not met) are visually distinct from unlocked ones
- [ ] Completed nodes (at maxLevel) are visually distinct from in-progress ones
- [ ] Level display matches the data (e.g., "Level 3 / 10" not "Level 3 / undefined")
- [ ] Prerequisite arrows/lines (if any) point in the correct direction (from required → dependent)

## Output

For each failed check:
1. Which tree and node ID is affected
2. What is wrong
3. The specific fix needed in `web/data/research.json` or the component

For data fixes, show the corrected JSON. For component fixes, show the corrected code snippet.
