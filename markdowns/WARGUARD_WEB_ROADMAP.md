# WarGuard Web — Product Roadmap

## Vision

A public game reference and companion site for Last Z players. No login required.

Players visit to look up game data, plan progression, track event schedules, and run calculations — the same way they currently visit wikis, Reddit, or stresswar.com, but with a better, more interactive experience built specifically for Last Z.

The Discord bot (WarGuard) handles personal timers and notifications. This site handles everything else.

---

## Product Thesis

Serious Last Z players constantly need answers to the same questions:

- "What buildings do I need before I can upgrade HQ to level 30?"
- "How many badges does maxing the Peace Shield tree cost?"
- "When is VS Research Day this week in my timezone?"
- "Which hero should I upgrade next?"
- "When is the next Full Preparedness sub-event?"

Today they answer these by:
- Scrolling through Reddit threads
- Asking in alliance Discord servers
- Visiting incomplete or out-of-date wikis
- Opening stresswar.com (which only covers some of this)

WarGuard Web becomes the single authoritative reference for Last Z — accurate, fast, interactive, and always updated.

The site drives organic discovery for the WarGuard Discord bot. Players who land on the site for a reference lookup see a CTA for the timer bot and invite it to their server.

---

## Target User

**Primary: Competitive Last Z player**

- Plays daily, spends real money on the game
- In an active alliance, knows the game mechanics deeply
- Looking for accurate data fast — doesn't want to scroll through Reddit
- Likely already in multiple Last Z Discord servers

**Secondary: Mid-level player learning the game**

- Needs guides, not just raw data tables
- Discovers the site via search ("Last Z HQ upgrade requirements")
- Uses event schedule to start planning their gameplay around server cycles

---

## Product Positioning

Not:
- A gameplay automation tool (no game API, no bots)
- A general gaming wiki (only Last Z, done deeply)
- A Discord-gated product (fully public, no login)
- A generic game database (built with player input, opinionated)

Instead:

**"The best reference site for Last Z — event schedules, upgrade data, research calculators, all in one place."**

Comparable to stresswar.com but more complete, more interactive, and actively maintained.

---

## Site Architecture

All pages are public. No login required.

| Page | Purpose |
|---|---|
| `/` | Hub — dark gaming landing page linking all sections |
| `/events` | Event schedule — VS weekly rotation, Apocalypse Time cycle, server timezone converter |
| `/hq` | HQ upgrade reference — levels 1–40, required buildings, resource costs, heroes cap |
| `/research` | Research trees — 9 tree overview with badge totals |
| `/research/[tree]` | Individual tree — interactive nodes with level/badge/stat breakdown, progress tracking in localStorage |
| `/heroes` | Heroes guide — cards with skills, levels, badge costs |
| `/tank` | Tank mechanics and upgrade data |
| `/calc` | Quick calculators — badge budget, resource planner, speed-up calculator |
| `/about` | What WarGuard Web is; link to Discord bot for timers |

---

## Feature Breakdown by Phase

---

### Phase 1 — Foundation & Event Schedule

**Goal:** Launch a live, SEO-indexed site. Start with the highest-traffic reference page.

**Timeline:** 1 week

#### Landing Page (`/`)
- Dark space gaming aesthetic (deep purple/black background, like stresswar.com)
- Animated starfield
- Section cards linking to each tool
- Header CTA: "Never miss a timer → Add the WarGuard Discord bot"
- Footer: Discord bot invite link

#### Event Schedule (`/events`)
- **VS Weekly Rotation** — table showing each day's VS event type:
  - Mon: Vehicle Day (use wrenches & blueprints)
  - Tue: Building Day (use construction speed-ups)
  - Wed: Research Day (use research speed-ups & badges)
  - Thu: Heroes Day (use hero fragments & cores)
  - Fri: Training Day (train troops & use speed-ups)
  - Sat: Combat Day (kill enemies & orange wanted missions)
  - Sun: Rest
- **Apocalypse Time Cycle** — Full Preparedness sub-events every 4 hours anchored to AT 00:00 (UTC 02:00). Shows current and next sub-event.
- **Recurring Events** — Arena Brawl (daily 01:30 UTC), Radar Reset (every 8h), Canyon Clash (Friday)
- **Timezone Converter** — Enter UTC offset → see all event times in local time. Defaults to browser timezone.

**Why events first:** The event schedule is the most frequently searched piece of game info. It drives repeat visits (players check it multiple times a week) and is the fastest to build (data already exists in `gamePresets.json`).

**Success Criteria:**
- Site live on custom domain
- Event schedule accurate to current AT server cycle
- Mobile responsive

---

### Phase 2 — HQ & Research Reference

**Goal:** Cover the two most-searched data categories. Establish the site as a credible reference.

**Timeline:** 2–3 weeks

#### HQ Upgrade Table (`/hq`)
- Table: levels 1–40
- Columns per level:
  - Required Buildings (e.g., "Laboratory Lv 14, Shooter Camp Lv 14")
  - Resource Cost: Wood, Food, Zent, Steel (formatted: 2.3G, 459.8M)
  - Heroes Cap (max heroes unlocked at this level)
- Sticky header
- Highlight current level via URL param (`/hq?level=22`)
- "What do I need for level X?" search box at top

#### Research Trees Overview (`/research`)
- Grid of 9 tree cards:
  - Tree name + icon
  - Node count
  - Total badge cost
  - Brief description
- Sourced from `data/research.json`

#### Individual Research Tree (`/research/[tree]`)
- All nodes listed with collapsible levels
- Per level: stat bonuses, badge cost, unlock requirement
- Running total: "Badges spent so far" as user clicks nodes
- "Auto-complete parents" when selecting a deep node
- **Progress saved in localStorage** — no login needed; reloads to saved state
- "Reset progress" button

**Success Criteria:**
- All 9 research trees browsable
- Progress tracking works in localStorage without login
- HQ table loads complete data for levels 1–40

---

### Phase 3 — Heroes, Tank & Calculators

**Goal:** Complete the core reference set. Add interactive calculation tools.

**Timeline:** 2–3 weeks

#### Heroes Guide (`/heroes`)
- Hero cards: portrait, name, class, role
- Per hero: skill levels 1–5 with stat bonuses and badge costs
- Filter by class or role
- Badge cost per hero summary

#### Tank Data (`/tank`)
- Tank specs by tier
- Upgrade requirements and costs
- Mechanic notes (formation bonuses, attack types)

#### Quick Calculators (`/calc`)
- **Badge Budget Calculator:** "I have X badges — which research trees can I max?"
- **Resource Planner:** "I have X Wood/Food/Zent/Steel — how many HQ levels can I afford?"
- **Speed-Up Calculator:** "How many 1h speed-ups do I need to cut X hours?"
- All calculators are client-side only — no backend needed

**Success Criteria:**
- All calculator inputs return correct results
- Heroes page shows complete skill data
- Tank page covers all tier data

---

### Phase 4 — AI Assistant

**Goal:** Answer the strategy questions players ask every day that static tables can't.

**Timeline:** 1–2 months (after Phase 3)

#### Chat Interface (on-page sidebar or `/ask` page)
- Powered by Claude API (`claude-sonnet-4-6`)
- No login required; anonymous session
- Game knowledge base via RAG — research guides, event data, hero builds, and game mechanics indexed as vectors

**Example queries:**
```
"Which research tree gives the most combat stats per badge?"
"What events are live during Apocalypse Time right now?"
"What should I upgrade first when I hit HQ 25?"
"What is VS Research Day and when should I use my speed-ups?"
```

#### Screenshot Analysis (Phase 4b)
- Upload a screenshot from Last Z → AI reads it and answers questions
- Use cases:
  - "What timers are showing on my screen?"
  - "What should I upgrade next based on this base view?"
  - "Is this attack worth sending?"
- Google Vision API for OCR extraction; Claude for interpretation

**AI Stack:**
- Claude API (`claude-sonnet-4-6`) for reasoning
- pgvector RAG over Last Z game knowledge base
- No user data needed — fully stateless per session

**Success Criteria:**
- Common game questions answered accurately
- Responses cite game mechanics correctly
- Screenshot OCR extracts timer values with 85%+ accuracy

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSG for reference pages = fast + SEO-indexed |
| Language | TypeScript | Consistent with Discord bot codebase |
| Styling | Tailwind CSS | Dark gaming theme, fast to ship, mobile responsive |
| Data | Static JSON in `/data/` | No database needed for reference content |
| Calculators | Client-side React | No backend needed |
| AI (Phase 4) | Claude API (`claude-sonnet-4-6`) | Best reasoning for strategy questions |
| OCR (Phase 4b) | Google Vision API | Best accuracy for mobile game screenshots |
| Hosting | Vercel | Native Next.js, free tier sufficient |

**No database needed for Phase 1–3.** All reference data is static JSON committed to the repo. Research progress uses localStorage. No auth, no user accounts, no backend.

---

## Game Data Strategy

Reference pages require structured game data. This does not come from an API — it must be curated manually.

**Data files (stored in `web/data/`):**

| File | Content | Status |
|---|---|---|
| `gamePresets.json` | Event schedule (VS rotation, AP cycle) | ✅ Complete (from Discord bot) |
| `hq.json` | HQ levels 1–40: buildings required, resource costs, heroes cap | 🔲 Needs populating |
| `research.json` | 9 trees × N nodes: badge costs, stat bonuses, unlock requirements | 🔲 Needs populating |
| `heroes.json` | Hero list: skills per level, badge costs | 🔲 Needs populating |
| `tanks.json` | Tank specs and upgrade data | 🔲 Needs populating |

**Sources for game data:**
1. Manual extraction from the game client (most accurate)
2. Community wikis and stresswar.com (verify before committing)
3. Alliance members with maxed research/buildings as reference

**Maintenance:** When the game patches, update the JSON file and redeploy Vercel. No database migration, no server changes.

---

## Relationship to Discord Bot

The web site and the Discord bot are separate products with a one-way relationship:

- The web site drives **discovery** of the Discord bot via CTAs
- The Discord bot handles **personal timers and notifications** — nothing on the web site duplicates this
- No shared database — the web site is fully static (Phase 1–3)
- No login on the web site — fully public

Cross-promotion placements:
- Sticky header banner: "Track your timers with the WarGuard Discord bot →"
- Events page: "Set an alert for this event → Add WarGuard to your server"
- Footer: Discord bot invite link on every page

---

## Go-To-Market

### Phase 1 Launch (Week 1–2)
- Post in r/LastZSurvivalShooter and top Last Z Discord servers
- "I built a free Last Z reference site — event schedule, HQ tables, coming soon: research trees"
- Show a screenshot of the events page
- Target: 200 monthly visitors

### Phase 2 Content (Month 1–2)
- SEO via page titles and meta descriptions: "Last Z HQ upgrade requirements", "Last Z research badge calculator", "Last Z VS schedule"
- Reddit posts for each new page launched
- Target: 1,000+ monthly visitors

### Phase 3 Creator Outreach (Month 2–3)
- Reach out to Last Z YouTube/TikTok creators (10K–100K followers)
- Offer to be cited in their guide videos as the reference site
- Target: 5,000+ monthly visitors

---

## Success Metrics

| Metric | Month 1 | Month 3 | Month 6 |
|---|---|---|---|
| Monthly visitors | 500+ | 3,000+ | 10,000+ |
| Discord bot invites from site CTAs | 25+ | 150+ | 500+ |
| Pages per session | 2+ | 2.5+ | 3+ |
| Returning visitors (30-day) | 30%+ | 40%+ | 50%+ |
| Top pages by traffic | `/events`, `/hq` | `/research`, `/calc` | `/heroes`, AI chat |

---

## Key Risks

| Risk | Mitigation |
|---|---|
| Game data becomes stale after patches | Monitor patch notes; assign data maintenance owner; version-stamp JSON files |
| stresswar.com covers the same content | Our edge: more complete, interactive research tracker, event calculator, AI (Phase 4) |
| Low SEO traction initially | Target long-tail queries; submit sitemap to Google; update content frequently |
| Phase 4 AI costs | Cap free AI queries per session (e.g., 5/day anonymous); Pro tier removes cap |
| Scope creep beyond Last Z | Stick to Last Z for Phase 1–3; multi-game is Phase 5 in the WarGuard roadmap |

---

## Competitive Gap Closure — stresswar.com Comparison (May 2026)

Full audit vs. lastz.stresswar.com. Items ordered by priority.

---

### ✅ P1 — Tank Modification Tracker (High Impact) — SHIPPED May 2026

**Gap:** Our `/tank` is a static 5-card summary. Their site is a full interactive tracker with all 49 modifications, individual sub-level toggles (levels 0–240), and a live Spent / Remaining wrench counter.

**Built:**
- All 49 modifications added to `tanks.json`: 8 tiers (Intern Modifier → Modding Overlord), levels 0–240, wrench cost per sub-level, total wrenches per mod
- `TankTrackerClient` component: tier-grouped mod list with amber vehicle-unlock dividers, toggle per mod, Spent/Remaining/progress bar in localStorage (`wg_tank_mods`), reset button
- Vehicle milestone time estimates: weekly rate input → calculates time to Cheetah / Hercules / Destroyer / Destroyer EX / Lv 240
- Static vehicle stage guide preserved below tracker

---

### ⏳ P1 — HQ Data: Levels 36–40 — DEFERRED

**Gap:** Our `hq.json` only covers levels 1–35. Their site shows levels up to 40 (36–40 marked "unconfirmed").

**Status:** Deferred — HQ 35 is confirmed as the current game maximum. Stresswar.com's 36–40 rows are speculative. No data to add until the game adds higher HQ levels in a future patch.

---

### ⏳ P1 — Shooter Training Research Tree — DEFERRED

**Gap:** Their changelog documents a "Shooter Training" tree added as a new research category. Our `research.json` does not include it.

**Status:** Deferred — Shooter Training is a post-endgame tree that unlocks only after 100% completion of Field Research (~594K badges). No public node-level data (names, badge costs, stat bonuses) exists yet. Will revisit when community data surfaces.

---

### ✅ P2 — Hero Roster Tracker — SHIPPED May 2026

**Gap:** Their heroes page has an "+ Activate" button per hero — players mark which heroes they've unlocked. We have no owned/unlocked state.

**Built:**
- `+` / `✓` toggle button on each hero card (top-left of portrait), persisted to localStorage (`wg_heroes_owned`)
- "X / 30 owned" count shown in `/heroes` header when any are marked
- Green "Owned (N)" filter pill (visible only once user has marked at least one hero)
- Empty state when "Owned" filter is active but nothing marked yet

---

### ✅ P2 — Global Research Badge Tracker — SHIPPED May 2026

**Gap:** Their `/research` index shows a single global Spent / Remaining badge counter across all trees. We only show per-tree progress on individual tree pages.

**Built:**
- `ResearchGlobalStats` client component on `/research` index page
- Reads all `wg_research_*` localStorage keys on mount, sums badges for completed nodes across all trees
- Shows Spent / Remaining / progress bar / % — invisible to new visitors (renders null if no progress)

---

### P3 — Feedback / Data Correction Form

**Gap:** They have a 4-category feedback form (General, Bug Report, Feature Request, Data Correction) with optional email reply. We have no user feedback mechanism.

**What to build:**
- Add `/feedback` page with a simple form:
  - Category dropdown: General | Bug Report | Feature Request | Data Correction
  - Message field (required)
  - Email field (optional, "include if you'd like a response")
  - Submit button
- Backend: route handler POSTing to a Discord webhook (no database needed — posts submissions to a private Discord channel)
- Disclaimer: not affiliated with game developers; in-game issues go to official support

---

### ✅ P3 — Research Auto-Complete Toggle — SHIPPED May 2026

**Gap:** Their changelog mentions an "auto-complete toggle" on research trees — likely a "mark all nodes complete" button.

**Built:**
- "Mark all complete" button on each research tree detail page (visible when not all nodes are done)
- Sequential / Custom mode toggle on tree detail pages: Sequential auto-completes all preceding nodes when a node is clicked; Custom allows free toggling

---

## Competitive Gap Closure — lastzdata.com Comparison (May 2026)

Full audit vs. lastzdata.com. Items ordered by priority. Note: items already captured in the stresswar.com section (tank tracker, HQ 36–40) are not duplicated here.

---

### ✅ P1 — Alliance Duel Calculator (Missing Category) — SHIPPED May 2026

**Gap:** lastzdata.com covers Alliance Duel as a dedicated calculator and guide section. We had zero Alliance Duel coverage.

**Built:**
- `alliance.json`: all 19 Alliance Recognition nodes with per-level badge costs (356,770 total verified), stat bonuses, categories, priority order, and 6-day event structure with tips
- `/alliance` page: tracker + day-by-day guide in one page
  - 19 nodes grouped by category (Chest Unlocks / Point Multipliers / Activity Incentives / Productivity / Resource Gathering)
  - Progress bar + badge counter + "+300% combined multiplier" callout
  - Collapsible 6-day event guide (Mon–Sat) with key items and strategy tips per day
  - localStorage persistence (`wg_alliance_ar`), reset button
- "Alliance" added to primary nav

---

### ✅ P1 — T10 Research Calculator (Calculator Upgrade) — SHIPPED May 2026

**Gap:** Our `/calc` had no T10 tracker. lastzdata.com has a dedicated calculator for the 22 technologies needed to unlock Tier 10 troops.

**Built:**
- `t10.json`: all 22 Unit Special Training nodes with full per-level badge costs (1,488,100 total verified), prerequisite arrays, phase groupings, 4 milestone checkpoints
- `/calc/t10` page: full T10 tracker
  - Sequential mode (default): locks nodes behind prerequisites, shows lock icon + "Requires: X, Y" on blocked nodes
  - Custom mode: free toggling
  - Phase milestone cards (Tier I / Bridge / Tier II / T10 Unlocked) showing remaining badges each
  - Building requirements callout (Lab/HQ/Barracks all Lv 30)
  - Recharge Shield priority callout (+50% Troop HP — don't skip it)
  - Mark all complete + Reset buttons
  - localStorage persistence (`wg_t10`)
- T10 link card added to `/calc` index page

---

### ✅ P2 — Tank Calculator: Weekly Rate → Time Estimate — SHIPPED May 2026

**Gap:** lastzdata.com's Modified Vehicle Calculator includes a unique feature our roadmap item doesn't: input your weekly wrench collection rate → get a time estimate (days, months, years) to complete full progression.

**Built:** Included in `TankTrackerClient` — "Weekly wrenches earned" input → computes time to each of 5 milestones (Cheetah, Hercules, Destroyer, Destroyer EX, Lv 240 max). Shows remaining wrenches and formatted time estimate per milestone card.

---

### ✅ P2 — Sequential vs. Custom Mode (Calculator Pattern) — SHIPPED May 2026

**Gap:** lastzdata.com uses a Sequential / Custom toggle across all their trackers. We had no equivalent.

**Built:** Mode toggle on all research tree detail pages (`/research/[tree]`). Sequential auto-completes all preceding nodes when a node is clicked; Custom allows free toggling of any node regardless of order. Pill-style toggle UI, `useState` flag only (no localStorage for mode itself). Apply same pattern to Alliance Duel and T10 Calculator when built.

---

### ✅ P3 — Alliance Duel Day-by-Day Event Guides — SHIPPED May 2026

**Gap:** No Alliance Duel guide content anywhere on the site.

**Built:** Included in the `/alliance` page — collapsible 6-day event guide (Mon–Sat) with key items, strategy tips, and reward callouts per day. Sourced from lastzguides.com and lastzdata.com.

---

## Competitive Gap Closure — lootbar.com Comparison (May 2026)

Full audit vs. lootbar.com Last Z content. LootBar is a diamond top-up commerce site whose Last Z coverage is entirely written articles — no interactive tools. We are already ahead on tools. These gaps are all written guide/reference content. Commerce features (top-ups, CD keys) are explicitly excluded.

Items ordered by priority.

---

### ✅ P1 — Redeem Codes Page — SHIPPED June 2026

**Gap:** LootBar maintains a regularly updated redeem codes page — one of the highest-traffic searches for any live-service game. We have no codes page.

**What to build:**
- `/codes` page with current active redeem codes for Last Z: Survival Shooter
- Table: Code | Rewards | Expiry (if known) | Source
- "How to redeem" instructions (in-game steps)
- "Last updated" datestamp at top
- Static data in page file — update manually when new codes drop (typically monthly or on events)
- SEO title: "Last Z Survival Shooter Redeem Codes [Month Year] — GAMIDES"

**Why P1:** Redeem code searches are the highest-volume queries for any live game. Players search for them multiple times per month. Every visit is a return visit opportunity and a discovery vector for the rest of the site.

---

### ✅ P1 — Badge Farming Guide — SHIPPED June 2026

**Gap:** LootBar has a detailed badge farming guide covering all monthly badge sources. Players actively search "how to get badges fast Last Z" — we have no dedicated badge guide.

**What to build:**
- Dedicated section on `/guide` (or `/guide/badges`) covering all badge sources:
  - Daily tasks (base amount per day)
  - Alliance Duel (Wednesday Age of Science — main weekly source)
  - VS weekly events (Research Day)
  - Events and limited-time sources
  - Monthly budget: what 250,000+ badges/month looks like
- Practical "badge priority" table: which sources to prioritize, which to never miss

---

### ✅ P2 — Event Strategy Guides — SHIPPED June 2026

**Gap:** LootBar covers several recurring events with full strategy guides. Our `/guide` page has general tips but no per-event deep dives.

**What to build** (one section per event, all on `/guide` or as `/guide/[event]` subpages):

- **Canyon Clash** — weekly PvP event; hero lineups, how scoring works, rewards
- **SVS / Capital Clash** — server-vs-server event; 9-box reward structure, scoring by activity
- **Zombie Saga** — wave survival event; best lineups, reward tiers, survival tips
- **Battlefield Breakout** — event mechanics, mastery tips, scoring

Each event guide: what the event is, how scoring works, what items to use, how to maximize rewards, what to avoid.

---

### ✅ P2 — F2P Progression Guide — SHIPPED June 2026

**Gap:** LootBar has a comprehensive F2P strategy guide covering diamond management, HQ rushing priorities, and common beginner mistakes. Our `/guide` has general tips but not a full F2P roadmap.

**What to build:**
- Dedicated F2P guide section on `/guide`:
  - Diamond management: what to spend on, what to never buy
  - Weekly task priority order (what earns the most per time invested)
  - HQ rush vs. research balance
  - When to shield, when to attack
  - Common mistakes that set F2P players back
  - Monthly progression milestones for F2P accounts

---

### P3 — Troop Formation & Assembly Guide

**Gap:** LootBar has a troop assembly and optimization guide covering unit types, upgrades, and battle formations.

**What to build:**
- Section on `/guide` or `/pvp` covering:
  - T1–T10 troop tier overview (when to train which tier)
  - Assaulter / Shooter / Rider roles and faction synergies
  - Formation slots: how many march slots, optimal troop mixes
  - When to promote vs. train new troops
  - Resource cost tradeoffs by tier

---

### P3 — City Capture & Defense Guide

**Gap:** LootBar has a city capture and defense guide — relevant for higher-level PvP players competing for territory.

**What to build:**
- Section on `/pvp` or `/guide` covering:
  - How city capture works (mechanics, requirements)
  - Defense setup: shield timing, trap placement, garrison
  - Offensive approach: scouting, timing attacks, rally mechanics
  - Alliance coordination for city capture events

---

### P3 — Season Migration Guide

**Gap:** LootBar publishes season migration guides when new seasons launch (e.g., Season 5). These are time-sensitive but recurring.

**What to build:**
- A `/guide/migration` page or section that explains:
  - What server migration is and when it happens
  - Migration score: how it's calculated, what contributes
  - Elite tier requirements (what CP/score is needed)
  - What carries over vs. resets on migration
- Update content each season cycle

---

## Open Questions

1. **Domain:** warguard.gg or a Last Z-specific domain (e.g., lastzguide.com)? A Last Z-specific domain may rank better in search.
2. **Data owner:** Who is responsible for populating and maintaining the game data JSON files?
3. **Research progress:** localStorage is fine for Phase 2, but if users want cross-device progress they need an account. Defer or add light auth later?
4. **Multi-game:** Whiteout Survival and Last War are listed in the WarGuard Phase 5 expansion. Build the site architecture to support multiple game subpaths (`/lastz/research`, `/lastwar/hq`) from the start?
