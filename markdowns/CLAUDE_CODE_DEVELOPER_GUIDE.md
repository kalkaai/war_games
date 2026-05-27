# Claude Code — Developer Guide for WarGuard Web

How to use Claude Code effectively when building the WarGuard web app. Covers context, memory, agents, and skills.

---

## CLAUDE.md Setup

Create `war_games/web/CLAUDE.md` before writing any code. Claude reads this at the start of every session — it replaces repeating context manually.

```markdown
# WarGuard Web

## What this is
Next.js 14 game reference site for Last Z players (stresswar.com clone).
No auth, no database — fully static public site.

## Stack
- Next.js 14 App Router, TypeScript, Tailwind CSS
- Static JSON data in /data/ (no DB reads on reference pages)
- Phase 4 only: Claude API (claude-opus-4-6) for AI chat, streaming

## Key conventions
- All game data lives in /data/*.json — never hardcode game values inline
- Pages are server components by default; only use 'use client' for interactivity
- Tailwind only — no CSS modules, no styled-components
- No extra abstractions: if a component is used once, keep it inline

## Data files (populate before building the page)
- /data/hq.json — HQ levels 1-40
- /data/research.json — 9 trees with nodes
- /data/heroes.json — hero list
- /data/gamePresets.json — already complete (copied from bot)

## What NOT to do
- Don't add auth (timers stay on the Discord bot)
- Don't add a database layer
- Don't create shared utility files for one-off operations
- Don't use 'use client' unless the component needs useState/useEffect
```

---

## Context

Context is the conversation window. It degrades as it fills — early instructions get compressed and Claude starts making inconsistent decisions.

### Rules

**Start each feature fresh.** Run `/compact` before switching between unrelated features. Context from "build the HQ table" bleeds into "build the research tree" and introduces inconsistencies.

**Open the files you want Claude to work with** in your IDE before asking about them. The IDE syncs open files into context automatically.

**Highlight specific code** you want referenced — the selection is injected into context automatically.

**Context budget:** CLAUDE.md + current task + 2–3 key files = ideal. Pasting the entire Discord bot codebase before asking about the web app wastes context on things Claude won't use.

### The Planning Trap

Long planning conversations followed by implementation in the same session is the most common mistake. By the time you ask for code, the planning discussion has consumed the useful context window. **Plan in one session. Implement in the next.**

### Per-Feature Context Checklist

Before starting any feature:
- [ ] `/compact` to clear previous feature's context
- [ ] Open the 2–3 files most relevant to this feature in the IDE
- [ ] Confirm CLAUDE.md is accurate for the current state of the codebase

---

## Memory

Memory lives at `~/.claude/projects/[project-path]/memory/` and persists across every session. `MEMORY.md` (first 200 lines) is always loaded automatically — no action needed.

### What to Save

Tell Claude to remember things it discovers while working:

```
"Remember: The dark theme base is bg-[#0a0014], purple-900/50 for cards —
not Tailwind's built-in dark colors"

"Remember: gamePresets.json uses UTC timestamps, not AT (Apocalypse Time).
AT = UTC - 2. Always convert for display."

"Remember: Next.js App Router server components can't use useState or useEffect —
always check before making a component client-only"

"Remember: The HQ data schema uses 'rss' as the resource key, not 'resources' or 'costs'"
```

### What NOT to Save

- Session-specific task details ("we're currently building the events page")
- Anything already in CLAUDE.md
- Anything that changes per feature
- Speculative decisions not yet confirmed in code

### Recommended Topic Files

Create separate files for detailed reference (link from MEMORY.md):

| File | Contents |
|---|---|
| `memory/data-schemas.md` | Final JSON shapes for hq.json, research.json, heroes.json |
| `memory/patterns.md` | Tailwind dark theme classes, settled component patterns |
| `memory/gotchas.md` | Bugs hit and how they were fixed |
| `memory/decisions.md` | Architectural decisions and why they were made |

---

## Agents

Agents are subprocesses Claude spawns to handle research and planning without consuming your main context window. The key principle: **agents handle research and planning, the main session handles implementation.**

### Explore Agent

Use before building anything that touches existing code. Don't read files yourself in the main context — delegate it.

**Example — before building the events page:**
> "Before I build the events page, explore the Discord bot codebase and tell me: what's in gamePresets.json, what types are in types/index.ts, and what TimerTypes are defined"

**Example — before extending a component:**
> "Explore web/components/ and describe the existing component patterns: file naming, prop typing conventions, whether they use default exports or named exports"

### Plan Agent

Use before any feature that touches more than 2 files.

**Example:**
> "Plan how to implement the interactive research tree node tracker. It needs to persist checked state in localStorage, auto-check parent nodes, and show running badge totals. Look at the existing component structure in web/components/ first."

The Plan agent reads the codebase, identifies exactly which files to touch, and surfaces design decisions before a line of code is written.

### Parallel Agents

The biggest time saver. When you need two independent pieces of information, send both agent calls in one message — they run simultaneously.

**Example:**
> - Agent 1 (Explore): "Analyze research.json and describe the node dependency structure — how are parent/child relationships represented?"
> - Agent 2 (Explore): "Fetch lastz.stresswar.com/research and describe how the interactive research tree works — what happens when you click a node?"

Both complete before you write a single line. Use parallel agents whenever the two questions are independent.

### Background Agents

For long-running research while you continue working:

> "In the background, explore all reference sections on stresswar.com (hq, research, heroes) and document the data structure and interaction model for each"

You keep working on something else; Claude notifies you when the agent completes.

### Worktree Isolation

For risky refactors or structural changes, use `isolation: "worktree"`. The agent works on a branch copy — if it goes wrong, your main working directory is untouched.

Use this when:
- Migrating a component pattern across all pages
- Restructuring the /data/ JSON schemas after pages are already built
- Large dependency upgrades

---

## Skills

Skills are slash commands that invoke specialized prompts.

### `/simplify`

Run after every component or feature. Strips over-engineering: unnecessary abstractions, redundant helpers, `'use client'` on components that don't need it.

Especially important for this project because static reference pages tempt Claude into creating data-fetching utilities and shared helpers that aren't needed.

**When to run:** After each feature is working but before committing.

### `/commit`

Generates a structured commit message with `Co-Authored-By`. Use at natural milestones — after the events page ships, after the HQ table ships. Don't commit mid-feature.

### `claude-developer-platform` (auto-triggered)

Fires automatically when code imports `@anthropic-ai/sdk`. When building the Phase 4 AI chat feature, this skill loads the full Claude API documentation — streaming patterns, tool use, prompt caching, model IDs — into context without you having to ask. Don't fight it; let it load before writing the API route.

---

## The Full Feature Workflow

Apply this sequence for every feature in the web app:

```
1. /compact
   Clear context from the previous feature

2. Parallel Explore agents (run simultaneously)
   → Agent 1: understand relevant existing code
   → Agent 2: research how the feature works on stresswar.com / elsewhere

3. Plan agent
   → Design before writing code
   → Identifies which files to touch
   → Surfaces tradeoffs

4. Define data schema (if needed)
   → Ask Claude to design the JSON schema
   → Populate the data file yourself
   → THEN build the component

5. Implement (main session)
   → CLAUDE.md + plan output + 2–3 key files = focused context
   → One feature per session

6. /simplify
   → Strip over-engineering before committing

7. Save discoveries to memory
   → "Remember: [pattern or gotcha discovered]"

8. /commit
   → Clean commit at the feature boundary
```

---

## Common Mistakes

| Mistake | Fix |
|---|---|
| Planning and implementing in the same session | `/compact` between plan and code |
| Asking Claude to build a page before the data schema is finalized | Schema first, component second |
| Letting Claude invent its own types instead of using the bot's | "Read discord_bot/src/types/index.ts before building this" |
| Running out of context mid-feature | Keep sessions focused to one feature |
| Not running `/simplify` | Over-engineering accumulates fast on a multi-page app |
| Building the AI chat feature in the same session as static pages | Separate session; let `claude-developer-platform` skill load |
| Saving session-specific state to memory | Memory is for stable patterns, not current task status |

---

## Phase-Specific Notes

### Phase 1 — Events Page
Use gamePresets.json from the Discord bot — it's already complete. The first Explore agent task should be to read it and describe the schema before you ask Claude to build the page.

### Phase 2 — HQ Table
Highest data risk. Agree on the hq.json schema with Claude before populating it. Building the component against the wrong schema means a refactor when real data arrives.

### Phase 3 — Research Trees
Most complex feature. Mandatory Plan agent session before implementation. The parent/child node dependency model needs to be fully designed before any component is written. LocalStorage persistence pattern must be established in memory so it stays consistent across the 9 trees.

### Phase 4 — AI Chat
Start a new session. The `claude-developer-platform` skill auto-loads when `@anthropic-ai/sdk` is imported. Key decisions to handle in the Plan phase:
- Tool use vs stuffed system prompt for game data (tools win — see AI architecture doc)
- Streaming route handler pattern in Next.js App Router
- Prompt caching on the static system prompt
- Model routing: Haiku for simple queries, Opus for strategy
