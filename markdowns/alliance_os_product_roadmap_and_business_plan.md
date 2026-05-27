# AllianceOS — Product Roadmap, Technical Architecture, Expansion Strategy & Revenue Projection

## Vision

AllianceOS is a Discord-native operations platform for competitive gaming alliances/guilds.

The platform combines:
- Event coordination
- Alliance scheduling
- Attendance tracking
- AI knowledge assistant
- Screenshot/OCR automation
- Analytics
- Multi-game operational tooling

Initial target:
- Last Z: Survival Shooter

Long-term target:
- Cross-game Guild/Alliance Operations Platform

---

# Core Product Thesis

Competitive mobile strategy games create operational pain for alliance leadership:

- repetitive reminders
- scheduling chaos
- timezone coordination
- event attendance tracking
- spreadsheet dependency
- fragmented knowledge
- constant repeated questions
- leadership burnout

AllianceOS centralizes these workflows into a single Discord-native platform.

---

# Product Positioning

Not:
- a wiki
- a calculator site
- a generic Discord bot
- gameplay automation

Instead:

## "Discord-native Alliance Operations Platform"

Comparable categories:
- Notion for gaming alliances
- Discord operations layer
- Guild management SaaS
- AI assistant for alliance coordination

---

# Initial Target Audience

## Primary Users

### Alliance Leadership
- R4/R5
- officers
- coordinators
- event organizers
- recruiters

### Secondary Users
- competitive alliance members
- event participants
- raid teams

---

# Core Product Pillars

## 1. Event Operations
- recurring events
- reminders
- timezone conversion
- RSVP workflows
- alliance schedules

## 2. Attendance & Analytics
- participation tracking
- event attendance history
- activity insights
- leadership dashboards

## 3. AI Knowledge Assistant
- game-specific answers
- alliance policy retrieval
- event explanations
- pinned-message indexing

## 4. Screenshot Intelligence
- OCR extraction
- event parsing
- countdown recognition
- build analysis

## 5. Cross-Game Expansion
- reusable operational framework
- game modules/plugins
- scalable SaaS platform

---

# Technical Architecture

## High-Level Architecture

```text
Discord Bot Layer
        ↓
API Gateway / Backend
        ↓
Core Services
- Scheduling
- AI Service
- OCR Service
- Analytics
- Notifications
        ↓
Database + Cache
        ↓
Game Adapters
```

---

# Recommended Stack

| Layer | Recommendation |
|---|---|
| Bot Framework | discord.js + TypeScript |
| Backend | NestJS or Fastify |
| Database | PostgreSQL |
| ORM | Prisma |
| Queue | BullMQ |
| Cache | Redis |
| AI | OpenAI API |
| Vector Search | pgvector |
| OCR | Tesseract |
| Frontend | Next.js |
| Hosting | Railway / Fly.io / AWS |

---

# Go-To-Market Strategy

## Phase 1: Community Seeding (Months 1–2)

### Goal
Get AllianceOS into 10–20 active alliances during MVP. Prioritize feedback over growth.

### Tactics
- Identify the top 20–30 Last Z Discord servers (by member count and activity)
- Reach out directly to R4/R5 leaders — offer free setup + white-glove onboarding
- Position as "free forever for early alliances" to reduce friction
- Join community spaces: Reddit (r/LastWar, r/MobileGaming), Discord alliance networks, Facebook groups
- Document every pain point discovered — this feeds Phase 2 feature prioritization

### Target
```text
10–20 active alliances
1–2 enthusiastic early adopters willing to give public testimonials
```

---

## Phase 2: Organic Growth (Months 3–5)

### Goal
Grow to 50–100 alliances through word-of-mouth and content.

### Tactics
- Members of existing alliances spread the bot organically when they join new servers
- Create short-form content: Discord screenshots showing clean event embeds, attendance dashboards — post on Reddit, TikTok, YouTube Shorts
- Partner with 2–3 Last Z content creators (mid-tier, 5K–50K followers) — offer free Pro tier in exchange for a mention or demo video
- Publish a free "Alliance Leadership Guide" (PDF or Notion doc) as a lead magnet — link to bot at the bottom

### Target
```text
50–100 alliances
First paying customers (10–25 Pro upgrades)
```

---

## Phase 3: Monetization Push (Months 5–6)

### Goal
Convert engaged free alliances to paid. Establish repeatable upgrade motion.

### Tactics
- Email/DM outreach to alliances actively using attendance tracking — show them their own data, offer Pro upgrade to unlock full analytics
- "Founding Alliance" pricing: lock in $9/mo forever if they upgrade before a cutoff date
- Referral program: "Invite another alliance → get 1 month free"
- Create a public changelog and announce new Pro features to drive urgency

### Target
```text
25–100 paying alliances
$250–$2,500 MRR
```

---

## Phase 4: Expansion (Months 7–12)

### Goal
Grow beyond Last Z. Establish AllianceOS as the category name.

### Tactics
- Launch support for 1–2 adjacent games (Whiteout Survival, Last War) — announce in their communities
- SEO content: "best Discord bot for [game name] alliances" — targets high-intent search
- Explore partnership or affiliate deal with game wikis/fansite communities
- Consider B2B angle: reach out to large multi-server alliance networks (clans that span multiple game servers)

### Target
```text
3+ supported games
200+ alliances
$2,000–$10,000 MRR
```

---

## 12-Month Milestone Target

| Month | Milestone |
|---|---|
| Month 2 | 20 active alliances, MVP validated |
| Month 4 | 75 alliances, first paid tier live |
| Month 6 | 100 alliances, 25+ paying, $1K+ MRR |
| Month 9 | 2 games supported, 200 alliances |
| Month 12 | 300+ alliances, $5K+ MRR, Phase 3 (AI) in progress |

---

# Product Development Roadmap

# PHASE 1 — MVP Foundation

## Goal

Validate:
- alliance pain points
- Discord workflows
- retention
- reminder usefulness

## Estimated Timeline

4–8 weeks

---

## Features

### Discord Bot

#### Slash Commands
```bash
/event create
/event edit
/event delete
/event list
/event next
```

---

### Scheduling System
- recurring reminders
- timezone support
- role pings
- recurring event templates

---

### Alliance Configuration
- timezone
- reminder channels
- role mappings
- leadership permissions

---

### Event Notifications
Examples:
- 24h reminder
- 1h reminder
- 15m reminder

---

### Discord Embeds
- clean countdown embeds
- formatted event cards
- RSVP buttons

---

## Technical Deliverables

### Infrastructure
- PostgreSQL schema
- Redis queues
- scheduling workers
- Docker setup
- CI/CD pipeline

### Core Services
- auth
- guild management
- event scheduler
- notification service

---

## Success Metrics

| Metric | Target |
|---|---|
| Active alliances | 20–50 |
| Weekly active users | 500+ |
| Reminder engagement | High |
| Event creation retention | Strong |

---

# PHASE 2 — Operational Automation

## Goal

Reduce leadership workload significantly.

## Estimated Timeline

2–3 months

---

## Features

### RSVP System
- attending
- maybe
- unavailable
- late

---

### Attendance Tracking
- participation logging
- event attendance history
- attendance percentages
- inactivity tracking

---

### Leadership Dashboard
- participation analytics
- event success rates
- alliance activity trends
- member engagement

---

### Smart Reminders
Examples:
- escalation reminders
- low RSVP alerts
- leadership warnings
- auto-role mentions

---

### Event Templates
Examples:
- Zombie Siege
- Canyon Clash
- Capital Clash
- Server War

---

## Technical Deliverables

### Analytics Engine
- attendance calculations
- event metrics
- leaderboard generation

### Permission System
- officer roles
- alliance admins
- event coordinators

---

## Success Metrics

| Metric | Target |
|---|---|
| Paying alliances | 25–100 |
| Daily active usage | Strong |
| Attendance adoption | High |
| Retention | 60%+ |

---

# PHASE 2 — Early Monetization

## Goal

Generate first revenue during Phase 2. Do not wait until a web dashboard exists to charge.

## Timing

Introduce paid tier at or before the end of Phase 2 (~month 3–4).

---

## Pricing at Launch

| Tier | Price | Features |
|---|---|---|
| Free | $0 | Basic reminders, limited events (5/mo), limited AI queries |
| Pro Alliance | $9/mo | Unlimited events, attendance tracking, analytics, smart reminders |
| Competitive Alliance | $25/mo | Everything in Pro + advanced dashboards, exports, priority support |

---

## Rationale

- Attendance tracking and smart reminders create daily dependency — this is when willingness to pay is highest
- Early revenue funds infrastructure costs (Redis, Postgres, AI API calls)
- Price anchors the product before Phase 3 AI features inflate perceived complexity
- Free tier drives viral growth within Discord servers — members join free, leadership upgrades

---

## Billing Implementation (Lightweight)

- Stripe integration (payment links or embedded checkout — no full billing portal needed yet)
- Manual upgrade flow acceptable at this stage
- Gate Pro features via guild-level flag in database
- Full SaaS billing infrastructure deferred to Phase 5

---

# PHASE 3 — AI Assistant

## Goal

Create a game-aware and alliance-aware AI system.

## Estimated Timeline

2–4 months

---

## Features

### AI Knowledge Assistant

Examples:
```text
What events are tomorrow?
What are our alliance rules?
What is Zombie Siege?
Who missed Canyon yesterday?
```

---

### RAG Knowledge System

Sources:
- alliance docs
- pinned messages
- guides
- event schedules
- FAQ channels

---

### Discord Knowledge Search
- searchable announcements
- indexed strategy discussions
- policy retrieval
- AI summaries

---

### Personalized Recommendations
Examples:
- progression advice
- build priorities
- participation suggestions

---

## Technical Deliverables

### AI Layer
- embeddings pipeline
- vector search
- prompt orchestration
- contextual retrieval

### Knowledge Base System
- guild-scoped knowledge
- game-specific docs
- indexed Discord content

---

## Success Metrics

| Metric | Target |
|---|---|
| AI queries/day | High |
| Knowledge retrieval accuracy | High |
| AI retention impact | Significant |

---

# PHASE 4 — OCR & Screenshot Intelligence

## Goal

Automate workflows using screenshots.

## Estimated Timeline

2–3 months

---

## Features

### OCR Event Parsing
Users upload screenshots:
- event screens
- countdowns
- schedules

Bot extracts:
- event name
- timers
- server info
- rewards

---

### Screenshot Analysis
Examples:
- battle reports
- hero compositions
- event participation
- ranking screenshots

---

### Auto Event Creation
Flow:
```text
Upload screenshot
→ OCR extraction
→ AI validation
→ Event created automatically
```

---

## Technical Deliverables

### OCR Pipeline
- image preprocessing
- OCR extraction
- structured parsing
- confidence scoring

### AI Validation Layer
- hallucination prevention
- event normalization
- timer verification

---

## Success Metrics

| Metric | Target |
|---|---|
| OCR success rate | 85%+ |
| Auto-created events | Increasing |
| User engagement | Strong |

---

# PHASE 5 — Web Dashboard & SaaS Platform

## Goal

Transition from bot to full operational platform.

## Estimated Timeline

3–6 months

---

## Features

### Web Dashboard
- calendars
- attendance analytics
- event history
- scheduling UI
- AI insights

---

### Alliance Management
- member management
- roster organization
- officer tools
- audit logs

---

### Multi-Server Support
- alliance clusters
- multi-guild communities
- shared operations

---

### Billing & Subscription System
- Stripe integration
- SaaS plans
- usage metering

---

## Technical Deliverables

### SaaS Infrastructure
- billing
- subscriptions
- rate limiting
- tenant isolation

### Observability
- monitoring
- logging
- analytics
- uptime tracking

---

## Success Metrics

| Metric | Target |
|---|---|
| MRR | $5k–25k |
| Paid alliances | 200–1000 |
| Churn | Low |
| Daily engagement | High |

---

# PHASE 6 — Multi-Game Expansion

## Goal

Become a cross-game guild operations platform.

---

## Target Games

### Initial Expansion
- Whiteout Survival
- Last War
- State of Survival

### Later Expansion
- Rise of Kingdoms
- Call of Dragons
- Evony
- Lords Mobile
- Infinity Kingdom

---

## Architecture Strategy

### Core Platform
Shared systems:
- scheduling
- AI
- OCR
- analytics
- Discord integration

---

### Game Plugins
Each game defines:
- event templates
- terminology
- OCR parsers
- knowledge base
- screenshots

---

## Example Plugin Interface

```ts
interface GamePlugin {
  gameId: string

  getEventTemplates(): EventTemplate[]

  parseScreenshot(image): ParsedGameData

  getKnowledgeBase(): KBSource[]

  getTerminology(): Glossary
}
```

---

# Long-Term Vision

## AllianceOS Becomes:

### Guild Infrastructure Layer
Across:
- mobile strategy games
- MMOs
- competitive communities

---

## Future Possibilities

### Advanced AI Features
- strategy recommendations
- alliance optimization
- participation forecasting
- event summaries

---

### Cross-Alliance Analytics
- benchmarking
- alliance comparisons
- recruitment intelligence

---

### Mobile App
- push notifications
- live schedules
- attendance check-ins

---

### Marketplace Ecosystem
Potential future:
- community templates
- premium AI packs
- alliance themes
- plugins/extensions

---

# Revenue Model

# Pricing Strategy

## Free Tier
Features:
- basic reminders
- limited events
- limited AI usage
- small alliance support

Purpose:
- viral growth
- onboarding
- community adoption

---

## Premium Tier

### Suggested Pricing

| Tier | Price |
|---|---|
| Casual Alliance | $5–15/mo |
| Competitive Alliance | $20–50/mo |
| Large Community | $100+/mo |

---

## Premium Features
- attendance analytics
- advanced AI
- OCR automation
- advanced dashboards
- exports
- recurring workflows
- unlimited reminders
- advanced integrations

---

# Revenue Projection

# Scenario 1 — Small Niche SaaS

## Assumptions
- 100 paying alliances
- average $15/mo

## Revenue

### Monthly
```text
$1,500 MRR
```

### Yearly
```text
$18,000 ARR
```

Likely achievable by:
- solo founder
- focused niche growth
- strong Discord adoption

---

# Scenario 2 — Strong Mid-Size SaaS

## Assumptions
- 1,000 paying alliances
- average $25/mo

## Revenue

### Monthly
```text
$25,000 MRR
```

### Yearly
```text
$300,000 ARR
```

Requirements:
- multiple supported games
- strong retention
- polished UX
- operational stickiness

---

# Scenario 3 — Large Cross-Game Platform

## Assumptions
- 5,000+ paying alliances
- average $30/mo

## Revenue

### Monthly
```text
$150,000+ MRR
```

### Yearly
```text
$1.8M+ ARR
```

Requirements:
- strong SaaS operations
- multi-game ecosystem
- excellent onboarding
- advanced AI tooling

---

# Most Valuable Revenue Drivers

## Highest Monetization Potential

### 1. Attendance Tracking
Leadership dependency feature.

### 2. AI Assistant
High engagement and retention.

### 3. OCR Automation
Feels highly differentiated.

### 4. Analytics
Strong operational value.

### 5. Workflow Automation
Creates daily dependency.

---

# Biggest Risks

## Technical Risks
- Discord API changes
- AI costs
- OCR accuracy
- scaling queues

---

## Product Risks
- community adoption
- onboarding friction
- feature overcomplexity
- weak retention

---

## Strategic Risks
- becoming too generic
- lack of operational depth
- overbuilding AI too early

---

# Key Strategic Recommendations

## 1. Start Narrow
Focus entirely on:
- Last Z
- Discord workflows
- alliance leadership pain

---

## 2. Prioritize Operational Stickiness
Build features alliances rely on daily.

Examples:
- attendance
- scheduling
- reminders
- AI retrieval

---

## 3. Avoid Gameplay Automation
Stay focused on:
- coordination
- scheduling
- analytics
- knowledge systems

Avoid:
- gameplay bots
- packet automation
- client modification

---

## 4. Optimize Setup Simplicity
Target:

```text
5-minute onboarding
```

This is critical for adoption.

---

# Final Strategic Summary

AllianceOS has strong potential because:

- mobile strategy alliances have operational pain
- Discord-native tooling is underserved
- leadership burnout is real
- AI + OCR create differentiation
- multi-game expansion is highly viable
- SaaS retention can become strong through workflow dependency

The strongest long-term opportunity is not:
- reminders
- calculators
- generic chatbots

It is:

## "Guild/Alliance Operations Infrastructure"

for competitive gaming communities.

