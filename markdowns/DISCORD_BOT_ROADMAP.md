# WarGuard — Individual Player Companion Roadmap

## Vision

A personal companion tool for mobile strategy game players (Last Z, Last War, Whiteout Survival).

The player never loses progress because they were offline at the wrong time.

---

## Product Thesis

Serious mobile strategy players are deeply financially invested ($50–500/mo in IAPs) but constantly lose value due to:

- Shields expiring while asleep → base gets raided → hours of resources lost
- Timers finishing unnoticed → construction/research sits idle for hours
- Missing alliance events → falling behind in competitive rankings
- Forgetting to collect resources before they cap

No polished, legitimate tool solves this for individual players today.

---

## Target User

**Not** alliance leaders managing 50 members.

**The individual competitive player:**
- Spends real money on the game
- Plays across multiple accounts (main + farms)
- Is in an active alliance but manages their own timers personally
- Currently uses sticky notes, phone alarms, or spreadsheets to track timers
- Has been raided after a shield expired because they forgot

---

## Product Positioning

Not:
- An alliance management platform
- A gameplay bot or automation tool
- A wiki or calculator site

Instead:

**"Your personal game assistant — never miss a timer, never lose your base"**

---

## Platform Strategy

### MVP — Discord Bot (Weeks 1–2)

Build the Discord bot first. Validate that players use it daily before investing in a web app.

**Why Discord bot for MVP:**
- Ships in 1–2 weeks vs 4–6 weeks for a web app
- Zero onboarding friction — player DMs the bot or adds it to their server
- Discord is already open while they're gaming
- Notifications are Discord DMs — no push notification infrastructure needed
- Auth is handled by Discord
- Same tech stack as AllianceOS (discord.js + Node.js)

**Discord bot interaction model:**
```
/timer add construction 4h30m "HQ upgrade"
/timer add shield 8h
/timer list
/timer clear HQ upgrade

→ Bot DMs you 30min before any timer expires
→ Bot DMs you at expiry with a second alert
```

### Phase 2 — Web App (Month 2–3)

Build the web app once the Discord bot proves daily retention. The bot backend is reused — only the frontend is new.

**Why web app second:**
- Better visual dashboard for timers (text embeds have limits)
- Screenshot upload for OCR is natural on web
- AI chat interface works better in a browser
- Sets up the path to mobile app

### Phase 4 — Mobile App (Month 5–8)

React Native app using the same backend. Native push notifications replace Discord DMs as the primary alert channel.

---

## Tech Stack

### MVP — Discord Bot

| Layer | Choice | Reason |
|---|---|---|
| Bot framework | discord.js + TypeScript | Same stack as AllianceOS, well documented |
| Backend | Node.js + Fastify | Lightweight, fast |
| Database | PostgreSQL + Prisma | Simple, reliable |
| Queue | BullMQ + Redis | Scheduled timer alerts |
| Hosting | Railway | One process, ~$5/mo to start |

### Phase 2 — Web App (added on top)

| Layer | Choice | Reason |
|---|---|---|
| Frontend | Next.js | Fast to ship, works on desktop and mobile browser |
| Auth | NextAuth (Discord OAuth) | Player already has Discord — one click login |
| OCR | Google Vision API | Best accuracy for mobile game screenshots |

### Phase 3 — AI (added on top)

| Layer | Choice | Reason |
|---|---|---|
| AI | Claude API (claude-sonnet-4-6) | Strategy advice, screenshot interpretation |
| Vector Search | pgvector | RAG over game knowledge base |

---

## Phase 1 — Discord Bot MVP (Weeks 1–2)

### Goal

Validate: **will players use this daily to track their timers?**

If D7 retention is 30%+, build the web app. If not, iterate on the bot before investing more.

---

### Commands

#### Timer Management
```
/timer add <type> <duration> [label]
  Types: construction, research, troops, healing, shield
  Example: /timer add shield 8h
  Example: /timer add construction 4h30m "HQ upgrade"

/timer list
  → Shows all active timers sorted by soonest expiry

/timer delete <label>

/timer clear
  → Removes all expired timers
```

#### Account Profiles (multi-account support)
```
/account add <name>
  Example: /account add "Farm 1"

/account switch <name>
  → All timer commands now operate on this profile

/account list
```

#### Alerts
```
/alerts set <minutes>
  → How many minutes before expiry to get a DM alert
  → Default: 30 minutes
  → Can set multiple: /alerts set 60,30,10

/alerts test
  → Sends a test DM to confirm notifications are working
```

---

### Alert Behavior

- Bot checks all active timers every minute via BullMQ scheduled job
- Sends a Discord DM to the user at each configured alert threshold
- Shield expiry alert format:
  ```
  ⚠️ Shield Alert — Main Account
  Your shield expires in 30 minutes.
  Login now to renew or your base will be exposed.
  ```
- Timer expiry alert format:
  ```
  ✅ Timer Complete — Main Account
  HQ upgrade (Construction) has finished.
  ```

---

### Out of Scope for Bot MVP

- Screenshot OCR (Phase 2)
- AI strategy advice (Phase 3)
- Web dashboard (Phase 2)
- Alliance/guild management (AllianceOS covers this)
- Base planner
- Resource calculator

---

## Success Metrics (Bot MVP)

| Metric | Target |
|---|---|
| DAU / MAU ratio | 40%+ (daily habit test) |
| Timers created per user | 3+ in first session |
| D7 retention | 30%+ |
| Users with 2+ account profiles | 20%+ |
| Alert DM delivery rate | 95%+ |

---

## MVP Monetization

Introduce paid tier within 2 weeks of first 50 active users.

Stripe payment link — no billing portal needed yet. Gate Pro via a user-level flag in the database.

| Tier | Price | Features |
|---|---|---|
| Free | $0 | 1 account profile, 5 active timers, 30min alerts only |
| Pro | $4.99/mo | Unlimited accounts, unlimited timers, custom alert thresholds, priority DMs |
| Annual | $39.99/yr | Pro features at ~33% discount |

```
/upgrade
→ Bot sends a Stripe payment link via DM
→ On payment, user's Pro flag activates automatically via Stripe webhook
```

---

## Phase 2 — Web App (Month 2–3)

### Goal

Add a visual dashboard on top of the validated bot backend. Same database, same timer data — new interface.

### Features

#### Timer Dashboard
- All active timers displayed as visual countdown cards
- Color-coded: green (plenty of time) → yellow (expiring soon) → red (expired)
- Sorted by soonest expiry
- Edit or delete timers inline

#### Account Switcher
- Sidebar with all account profiles
- One-click switch between Main, Farm 1, Farm 2, etc.

#### Screenshot OCR Import
- Player uploads a screenshot from Last Z / Last War
- Google Vision API extracts all visible timers and countdowns
- Extracted data populates the timer dashboard automatically
- Player confirms or edits before saving
- Supported screens: base overview, research, troop queue, healing queue, shield

#### Web Notifications
- Browser push notifications as alternative to Discord DMs
- Player can enable both — Discord DM + browser push

### Auth
- Discord OAuth via NextAuth — player logs in with same Discord account used with the bot
- No separate registration needed

---

## Phase 3 — AI Strategy Assistant (Month 3–5)

### Goal

Answer the questions players ask every day in Discord and Reddit.

### Discord Commands (bot extension)
```
/ask <question>
  Example: /ask What should I upgrade next?
  Example: /ask Is my hero build good for rally?
  Example: /ask What events are coming up this week?
```

### Web Chat Interface
- Persistent chat in the web dashboard
- Context-aware: AI sees the player's current timers and account state
- Game knowledge base via RAG (event guides, upgrade priorities, hero builds)

### Screenshot Analysis
Player uploads a screenshot and asks:
```
"What should I upgrade next?"
"Is this attack worth sending?"
"How's my base layout?"
```

### AI Stack
- Claude API (claude-sonnet-4-6) for reasoning and answers
- pgvector RAG over curated Last Z / Last War knowledge base
- Timer + account context passed per query

---

## Phase 4 — Mobile App (Month 5–8)

### Goal

Native app for better notification reliability and lock screen access.

### Approach
- React Native (iOS + Android, single codebase)
- Same backend — no changes needed
- Native push notifications replace Discord DMs as primary alert channel
- Lock screen widget showing next timer to expire

### Monetization
- Move to App Store + Google Play billing alongside Stripe
- Annual pricing emphasis for better LTV

---

## Phase 5 — Multi-Game Expansion (Month 8–12)

### New Games
- Last War (largest MAU in genre)
- Whiteout Survival
- State of Survival

Each new game requires:
- OCR template set for that game's UI screens
- Game-specific knowledge base for AI
- Event calendar for recurring game events

### Platform Features
- Community timer templates ("HQ 20 build order — 14 timers pre-loaded, one click import")
- Import/export personal timer presets
- Alliance leader view: aggregate member readiness for members who opt in to sharing

---

## Revenue Projections

| | Month 3 | Month 6 | Month 12 |
|---|---|---|---|
| Free users | 500 | 3,000 | 15,000 |
| Paid conversion | 8% | 10% | 12% |
| Paying users | 40 | 300 | 1,800 |
| ARPU | $4.99 | $5.50 | $6.00 |
| MRR | ~$200 | ~$1,650 | ~$10,800 |
| ARR | ~$2,400 | ~$19,800 | ~$129,600 |

---

## Go-To-Market

### Month 1 — Seeding
- Post in Last Z subreddits and Discord servers as a player, not a marketer
- "I built a timer bot because I kept getting raided — here it is, free to use"
- Let the product speak — show a screenshot of the `/timer list` embed
- Target: 100 free users, 5–10 paying

### Month 2 — Content
- Short TikTok/YouTube Shorts: "How I never get raided anymore"
- Reddit posts in r/LastZSurvival: "Shield alert Discord bot for Last Z"
- Target: 500+ free users, 40+ paying

### Month 3–4 — Creator Partnerships
- Reach out to 3–5 Last Z YouTube/TikTok creators (10K–100K followers)
- Offer 3 months free Pro in exchange for an honest mention
- Target: 2,000+ free users, 150+ paying

### Month 5+ — SEO + Community
- SEO via web app: "Last Z timer tracker", "Last War shield alert", "Whiteout Survival reminder"
- WarGuard Discord server for users — feedback loop + community
- Alliance leaders share the bot with their members → viral loop into AllianceOS

---

## Key Risks

| Risk | Mitigation |
|---|---|
| Low D7 retention on bot | Onboarding must create a timer in the first interaction — reduce friction to zero |
| Discord DM delivery failures | Redundant alerts (60min + 30min + 10min); web push when app launches |
| OCR accuracy on varied screenshots | Start with high-confidence screens only; manual confirm step before saving |
| Single game dependency | Multi-game expansion is Phase 5 — built into plan from day one |
| Players use in-game alarms instead | Multi-account support is the differentiator — game only supports 1 account natively |

---

## Relationship to AllianceOS

WarGuard and AllianceOS are complementary, not competing:

| | WarGuard | AllianceOS |
|---|---|---|
| Customer | Individual player | Alliance leadership |
| Pain solved | Personal timers, shield alerts | Event ops, attendance, AI knowledge |
| Primary channel | Discord bot → web app → mobile | Discord bot |
| Pricing | Per user ($4.99/mo) | Per alliance ($9–25/mo) |
| Viral loop | Player → friends → alliance | Alliance → members |
| Shared tech | discord.js, Node.js, PostgreSQL, Redis, Claude API | Same |

**Cross-sell flywheel:** WarGuard players who lead alliances discover AllianceOS. AllianceOS alliance members get recommended WarGuard for personal timers. Both products grow each other with zero paid acquisition.
