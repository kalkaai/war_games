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

### P1 — Tank Modification Tracker (High Impact)

**Gap:** Our `/tank` is a static 5-card summary. Their site is a full interactive tracker with all 49 modifications, individual sub-level toggles (levels 0–240), and a live Spent / Remaining wrench counter.

**What to build:**
- Add full modification data to `tanks.json`: 49 mods across 8 difficulty tiers (Intern Modifier → Modding Overlord), each with sub-levels and wrench cost per sub-level
- Convert `/tank` from static guide to interactive tracker:
  - Toggle each sub-level complete
  - Live wrench Spent / Remaining counter (max: 70,700)
  - Progress saved in localStorage (same pattern as research trees)
  - Tier groupings with color badges
- Named mods to include: Elite Weapon I/II/III, Elite Tire I/II/III, Elite Trunk I/II/III, Plasma Chain, Inferno Furnace, Phase Amp, plus all others

---

### P1 — HQ Data: Levels 36–40

**Gap:** Our `hq.json` only covers levels 1–35. Their site shows levels up to 40 (36–40 marked "unconfirmed").

**What to build:**
- Research and add levels 36–40 to `hq.json` (required buildings, resource costs, heroes cap, build time)
- Mark unverified rows with a `confirmed: false` flag; display a visual "Unconfirmed" badge in the table
- Update HQ resource planner calculator to support range up to level 40

---

### P1 — Shooter Training Research Tree

**Gap:** Their changelog documents a "Shooter Training" tree added as a new research category. Our `research.json` does not include it.

**What to build:**
- Research node names, badge costs, and stat bonuses for the Shooter Training tree
- Add as a 10th tree to `research.json`
- Appears automatically on `/research` grid and is fully interactive on `/research/shooter-training`

---

### P2 — Hero Roster Tracker

**Gap:** Their heroes page has an "+ Activate" button per hero — players mark which heroes they've unlocked. We have no owned/unlocked state.

**What to build:**
- Add a toggle per hero card on `/heroes` (e.g., "Owned" checkbox or star icon)
- Save to localStorage keyed by hero ID
- Show owned count in header (e.g., "12 / 30 heroes owned")
- Optional: filter view to "Owned only" or "Not yet owned"

---

### P2 — Global Research Badge Tracker

**Gap:** Their `/research` index shows a single global Spent / Remaining badge counter across all trees. We only show per-tree progress on individual tree pages.

**What to build:**
- On `/research` index, compute total badges spent across all trees from localStorage
- Display "X badges spent · Y remaining" summary at top of page (same pattern as per-tree view)
- Pulls from the same localStorage keys already written by `ResearchTreeClient`

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

### P3 — Research Auto-Complete Toggle

**Gap:** Their changelog mentions an "auto-complete toggle" on research trees — likely a "mark all nodes complete" button.

**What to build:**
- Add "Mark all complete" / "Mark all incomplete" toggle button to each research tree detail page
- Sits alongside the existing "Reset progress" button
- Updates localStorage in one action

---

## Competitive Gap Closure — lastzdata.com Comparison (May 2026)

Full audit vs. lastzdata.com. Items ordered by priority. Note: items already captured in the stresswar.com section (tank tracker, HQ 36–40) are not duplicated here.

---

### P1 — Alliance Duel Calculator (Missing Category)

**Gap:** lastzdata.com covers Alliance Duel as a dedicated calculator and guide section. We have zero Alliance Duel coverage — not a single page. This is a major recurring game event.

**What the Alliance Duel is:** A multi-day competitive event between alliances. Each day focuses on a different activity (Day 1: Modded Vehicle Power, Day 2: Shelter Upgrade, Day 3: Age of Science). Players earn Alliance Recognition badges through a 19-node research tree (356,770 total badges).

**What to build:**

*Data:*
- Add `alliance.json` with 19 Alliance Recognition research nodes: names, per-level badge costs, stat bonuses (resource gathering +%, event multipliers +%, march speed, training rewards, chest unlocks, "One More" daily doubler)

*Page (`/alliance`):*
- Alliance Recognition tracker (same pattern as research tree detail):
  - Sequential mode: prerequisite-locked node progression
  - Custom mode: freely set any node level regardless of order
  - Spent / Remaining badge counter (total pool: 356,770)
  - Progress bar + % complete
  - Save to localStorage
- Alliance Duel weekly event guide section:
  - Day 1: Modded Vehicle Power — tips (upgrade tank mods, spend wrenches)
  - Day 2: Shelter Upgrade — tips (queue building upgrades in advance)
  - Day 3: Age of Science — tips (use research speed-ups, time badge spend)
  - What rewards to expect (orange-tier items, alliance chests)

**Why P1:** Alliance Duel is a high-engagement recurring event. Players actively search for tips and badge tracking for it. Neither stresswar.com nor our site covers it. This is a clear gap to own.

---

### P1 — T10 Research Calculator (Calculator Upgrade)

**Gap:** Our `/calc` Badge Budget Calculator asks "can I max tree X with Y badges?" — lastzdata.com has a dedicated T10 Research Calculator that tracks the 22 specific technologies required to unlock Tier 10 units, with per-tech level sliders and sequential/custom modes.

**What the T10 path is:** A specific sequence of research nodes across trees that unlocks T10 troops — the most important long-term progression milestone for competitive players.

**What to build:**
- Add a dedicated T10 Research Calculator to `/calc` (or as `/calc/t10`):
  - 22 technology sliders (level 0 → max per tech)
  - Sequential mode: prerequisites locked until parent nodes are complete
  - Custom mode: set any tech independently
  - Per-tech: stat shown, level range, badge cost per level, cumulative cost
  - Live Spent / Remaining / % complete summary panel
  - Example techs: Fire Up (10 levels, 21,350 badges), Recharge Shield (20 levels, 219,000 badges), Unit Special Training (1 level, 54,900 badges)
- Save progress to localStorage

**Why P1:** T10 units are the defining milestone for competitive Last Z players. A T10-specific tracker answers the most common planning question: "how many badges until I unlock T10?"

---

### P2 — Tank Calculator: Weekly Rate → Time Estimate

**Gap:** lastzdata.com's Modified Vehicle Calculator includes a unique feature our roadmap item doesn't: input your weekly wrench collection rate → get a time estimate (days, months, years) to complete full progression. This is more useful than just a toggle tracker.

**What to build (add-on to P1 Tank Tracker from stresswar.com section):**
- Add "Weekly wrenches earned" number input at the top of `/tank`
- Compute: estimated days/months to reach each vehicle milestone (Cheetah, Hercules, Destroyer, Destroyer-EX, full 70,700)
- Show floating or sticky "At your pace: X months to Destroyer" summary
- No save needed — derived from wrench count + current progress state

---

### P2 — Sequential vs. Custom Mode (Calculator Pattern)

**Gap:** lastzdata.com uses a Sequential / Custom toggle across all their trackers. Sequential locks nodes behind prerequisites (matching how the game works); Custom lets players set any level freely for planning hypotheticals. We have no equivalent — our research trees always require sequential clicking.

**What to build:**
- Add a mode toggle to research tree detail pages (`/research/[tree]`):
  - **Sequential** (default): clicking a node auto-completes all parents (current behavior)
  - **Custom**: any node can be toggled independently, no prerequisite enforcement
- Apply same pattern to the T10 calculator and Alliance Duel tracker when built
- Single `useState` flag, no localStorage needed for the mode itself

---

### P3 — Alliance Duel Day-by-Day Event Guides

**Gap:** lastzdata.com publishes written guides for each day of Alliance Duel (Day 1/2/3 tips, authored by players). We have no Alliance Duel guide content.

**What to build:**
- Extend the `/alliance` page (or add `/guide/alliance-duel`) with:
  - Day-by-day breakdown: what activity is scored, what items to use, what to prepare in advance
  - Tip cards per day (same card format as `/guide` page)
  - "What rewards to expect" section (orange-tier items, recognition badges, chest drops)
- Static content in the page file — no data file needed

---

## Open Questions

1. **Domain:** warguard.gg or a Last Z-specific domain (e.g., lastzguide.com)? A Last Z-specific domain may rank better in search.
2. **Data owner:** Who is responsible for populating and maintaining the game data JSON files?
3. **Research progress:** localStorage is fine for Phase 2, but if users want cross-device progress they need an account. Defer or add light auth later?
4. **Multi-game:** Whiteout Survival and Last War are listed in the WarGuard Phase 5 expansion. Build the site architecture to support multiple game subpaths (`/lastz/research`, `/lastwar/hq`) from the start?
