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

### Phase 1.5 — Progress Tracking (localStorage, ships now)

Static progress profile on the GAMIDES web app using localStorage. No auth, no backend — ships immediately. Migrates to server-side when Phase 2 auth lands.

- HQ level, hero roster + ranks, key research levels, tank tier
- Manually entered, persisted in browser localStorage
- Device-specific until auth migration

### Phase 2 — Auth + Database (Month 2)

Discord OAuth login and database to back the progress profile across devices. No payments yet.

- Discord OAuth via NextAuth
- Database schema for user progress profile
- Migrate localStorage data to DB on first login

### Phase 3 — Web App + Stripe (Month 2–3)

Build the timer dashboard and wire up payments once auth + DB are in place.

- Timer dashboard, account switcher, web notifications
- Stripe subscription (monthly + annual), webhook activates Pro flag
- Pro flag gates AI assistant and OCR import

### Phase 5 — Mobile App (Month 5–8)

React Native app using the same backend. Native push notifications replace Discord DMs as the primary alert channel.

---

## Tech Stack

### MVP — Discord Bot

| Layer | Choice | Reason |
|---|---|---|
| Bot framework | discord.js + TypeScript | Same stack as AllianceOS, well documented |
| Backend | Node.js + Fastify | Lightweight, fast |
| Database | Firestore (GCP Firebase) | Already live, stores users/{discordId}/accounts/timers |
| Queue | BullMQ + Redis | Scheduled timer alerts |
| Hosting | Railway | One process, ~$5/mo to start |

### Phase 1.5 — Progress Tracking (added on top)

| Layer | Choice | Reason |
|---|---|---|
| Storage | localStorage | No backend needed, ships immediately |

### Phase 2 — Auth + Database (added on top)

| Layer | Choice | Reason |
|---|---|---|
| Auth | NextAuth (Discord OAuth) | Player already has Discord — one click login |
| Session store | Firestore via @auth/firebase-adapter | Same project as bot, no new infrastructure |
| Profile store | Firestore users/{discordId} | Extends existing user doc, shared with bot |
| Admin SDK | firebase-admin (same service account) | Reuse bot credentials |

### Phase 3 — Web App + Stripe (added on top)

| Layer | Choice | Reason |
|---|---|---|
| Frontend | Next.js on Vercel | Fast to ship, works on desktop and mobile browser |
| Payments | Stripe (subscriptions + webhook) | Pro flag activated on payment event |
| OCR | Google Vision API | Best accuracy for mobile game screenshots |

### Phase 4 — AI (added on top)

| Layer | Choice | Reason |
|---|---|---|
| AI | Claude API (claude-sonnet-4-6) | Strategy advice, screenshot interpretation |
| Knowledge base | Firestore + vector search | RAG over game knowledge base |

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

| Tier | Price | Who Pays | Features |
|---|---|---|---|
| Free | $0 | — | 1 account profile, 5 active timers, 30min alerts only, progress tracking (HQ, heroes, research, tank) |
| Pro | $4.99/mo | Individual player | Unlimited accounts, unlimited timers, custom alert thresholds, priority DMs, AI Strategy Assistant, OCR import |
| Annual | $39.99/yr | Individual player | Pro features at ~33% discount |

**Note:** Alliance-level features (event scheduling, attendance tracking, RSVP, AI assistant) are part of AllianceOS — a separate per-server subscription ($14.99–$24.99/mo) paid by the alliance leader, covering all members. The two products share the same Discord bot infrastructure and cross-sell each other.

```
/upgrade
→ Bot sends a Stripe payment link via DM
→ On payment, user's Pro flag activates automatically via Stripe webhook
```

---

## Phase 2 — Auth + Database (Month 2)

### Goal

Add Discord login and migrate the localStorage progress profile to the database so data persists across devices.

### Auth
- Discord OAuth via NextAuth — player logs in with same Discord account used with the bot
- No separate registration needed

### Database
- Extends existing Firestore `users/{discordId}` document with a `profile` field
- On first login: import localStorage data into Firestore, clear localStorage
- Same Firebase project and service account as the Discord bot

---

## Phase 3 — Web App + Stripe (Month 2–3)

### Goal

Add the timer dashboard and payments on top of the validated auth + DB layer. Requires Phase 2 to be in place.

### Features

#### Timer Dashboard
- All active timers displayed as visual countdown cards
- Color-coded: green (plenty of time) → yellow (expiring soon) → red (expired)
- Sorted by soonest expiry
- Edit or delete timers inline

#### Account Switcher
- Sidebar with all account profiles
- One-click switch between Main, Farm 1, Farm 2, etc.

#### Screenshot OCR Import *(Pro)*
- Player uploads a screenshot from Last Z / Last War
- Google Vision API extracts all visible timers and countdowns
- Extracted data populates the timer dashboard automatically
- Player confirms or edits before saving
- Supported screens: base overview, research, troop queue, healing queue, shield

#### Player Profile — Progress Tracking *(Free)*
- HQ level
- Hero roster + ranks
- Key research levels (combat, development)
- Tank tier
- Manually entered; OCR import can auto-populate *(Pro)*
- Serves as context for the AI assistant in Phase 4

#### Web Notifications
- Browser push notifications as alternative to Discord DMs
- Player can enable both — Discord DM + browser push

#### Payments
- Stripe subscription (monthly + annual plans)
- Webhook endpoint activates/deactivates Pro flag on user record
- `/upgrade` bot command sends Stripe payment link via DM
- Web `/upgrade` page for players who arrive via the web app

---

## Phase 4 — AI Strategy Assistant *(Pro only)* (Month 3–5)

### Goal

Answer the questions players ask every day in Discord and Reddit. **Pro feature** — AI inference costs money per query; gated behind the paid tier.

### Discord Commands (bot extension, Pro only)
```
/ask <question>
  Example: /ask What should I upgrade next?
  Example: /ask Is my hero build good for rally?
  Example: /ask What events are coming up this week?

→ Free users see: "AI assistant is a Pro feature. /upgrade to unlock."
```

### Web Chat Interface *(Pro only)*
- Persistent chat in the web dashboard
- Context-aware: AI sees the player's current timers, account state, and saved progress profile
- Game knowledge base via RAG (event guides, upgrade priorities, hero builds)

### Screenshot Analysis *(Pro only)*
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

## Phase 5 — Mobile App (Month 5–8)

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

## Phase 6 — Multi-Game Expansion (Month 8–12)

Each new game requires only a game plugin (event templates, timer type labels, OCR parsers, knowledge base). The bot engine, alert system, and account infrastructure are fully reused.

### Tier 1 — Launch First (Months 8–12)
Highest MAU, same mechanics as Last Z, most active Discord communities.

| Game | Publisher | Est. 2025 Revenue |
|---|---|---|
| Last War: Survival | FunFly | ~$2.2B/yr |
| Whiteout Survival | Century Games | ~$1.4B/yr |
| Kingshot | Century Games | ~$500M/yr |

### Tier 2 — Year 2
| Game | Publisher |
|---|---|
| Rise of Kingdoms | Lilith Games |
| Lords Mobile | IGG |
| State of Survival | FunPlus |
| Evony | TG Inc |

### Tier 3 — Year 2–3
| Game | Publisher |
|---|---|
| Puzzles & Survival | 37Games |
| Last Fortress: Underground | IM30 |
| Last Shelter: Survival | Long Tech Network |
| Call of Dragons | Lilith Games |
| Age of Z Origins | Camel Games |
| Infinity Kingdom | GTArcade |

### Tier 4 — Year 3+
- Doomsday: Last Survivors
- Frozen City
- Warpath

### Platform Features
- Community timer templates ("HQ 20 build order — 14 timers pre-loaded, one click import")
- Import/export personal timer presets
- Alliance leader view: aggregate member readiness for members who opt in to sharing

---

## Revenue Projections

### Individual Player Subscriptions

| | Month 3 | Month 6 | Month 12 |
|---|---|---|---|
| Free users | 500 | 3,000 | 15,000 |
| Paid conversion | 8% | 10% | 12% |
| Paying users | 40 | 300 | 1,800 |
| ARPU | $4.99 | $5.50 | $6.00 |
| MRR | ~$200 | ~$1,650 | ~$10,800 |
| ARR | ~$2,400 | ~$19,800 | ~$129,600 |

### Ad Revenue (Bot + Web App Combined)
Bot ads (sponsored embeds, partner integrations) and web app display ads are a secondary revenue stream.

| | Month 6 | Month 12 | Year 2–3 (multi-game) |
|---|---|---|---|
| Bot ads | ~$100/mo | ~$500/mo | ~$2,000/mo |
| Web ads | ~$200/mo | ~$1,000/mo | ~$5,000/mo |
| Combined ad ARR | ~$3,600 | ~$18,000 | ~$84,000 |

Note: gaming audiences have ~35–40% ad blocker rates. Ad revenue is supplementary — subscriptions are the primary driver.

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
| Pricing | Per user ($4.99/mo) | Per server ($14.99–$24.99/mo) |
| Viral loop | Player → friends → alliance | Alliance → members |
| Shared tech | discord.js, Node.js, Firestore (Firebase), Redis, Claude API | Same |

**Cross-sell flywheel:** WarGuard players who lead alliances discover AllianceOS. AllianceOS alliance members get recommended WarGuard for personal timers. Both products grow each other with zero paid acquisition.
