# 🎮 War Games Companion — Product Analysis

## The Opportunity

**Target Market:** 30-40M monthly active players across Last War, Last Z, and similar mobile zombie/strategy games.

**Core Problem:** Players in base-building strategy games lose progress when offline:
- Resources go uncollected and cap out
- Shields expire → base gets raided
- Timed events and rallies are missed
- Alliance coordination is chaotic (spread across Discord, Line, WhatsApp)

**Key Insight:** Players in Last War alone spend an estimated **$70M+/month** on in-app purchases. They are *deeply invested* and willing to pay for tools that protect that investment.

---

## Two Product Paths

### Path A: Legitimate Companion Tool ✅ (Recommended)
A standalone app/web dashboard that **does not touch game data** — instead it provides smart utilities around the game.

| Pros | Cons |
|------|------|
| No ToS/legal risk | Can't automate in-game actions |
| Sustainable, scalable business | Requires building community trust |
| App Store distributable | Feature set is more limited |
| Partnership potential with devs | |

### Path B: Automation Bot Service ⚠️ (High Risk)
Software that directly automates gameplay via emulators or device control.

| Pros | Cons |
|------|------|
| Huge demand, instant revenue | Violates every game's ToS |
| Players will pay $10-30/mo | Constant anti-cheat cat-and-mouse |
| Proven gray-market model | Legal liability (DMCA/CFAA) |
| | Can't distribute via App Stores |
| | High churn from ban waves |

> [!IMPORTANT]
> **Recommendation:** Go with **Path A**. It's the only path that builds a real, lasting business. Path B generates quick cash but is fundamentally unsustainable and carries legal risk.

---

## Recommended Product: "WarGuard" (Working Name)

A **freemium companion app** for mobile strategy game players.

### Core Features (Free Tier)

#### 1. ⏰ Smart Timer Dashboard
- Track all your active timers: construction, research, troop training, healing
- **Push notifications** before timers expire
- "Shield Expiry Alert" — the #1 most requested feature in these communities

#### 2. 🏰 Base Planner
- Visual base layout optimizer
- Import/export layouts to share with alliance members
- "What should I upgrade next?" recommendations based on current state

#### 3. 👥 Alliance Hub
- Shared event calendar with push reminders
- Member roster with power tracking (manual input or screenshot OCR)
- Rally coordination — schedule attacks, notify participants
- Replace fragmented Discord/Line/WhatsApp groups

#### 4. 📊 Resource Calculator
- "How long until I can afford X upgrade?"
- Optimal resource allocation recommendations
- Daily/weekly progress tracking

### Premium Features ($4.99/mo or $39.99/yr)

#### 5. 🤖 AI Strategy Advisor
- Analyze screenshots of enemy bases and suggest attack strategies
- Hero team composition optimizer
- "Should I migrate servers?" analysis based on server power rankings

#### 6. 📸 Screenshot OCR Engine
- Take a screenshot → auto-extract all visible data (resources, timers, power levels)
- Eliminates manual data entry for tracking
- Powers the smart recommendations

#### 7. 🔔 Advanced Notifications
- Multi-account management (track farm accounts)
- Custom notification rules ("Alert me if any shield expires within 30 min")
- Discord/Telegram webhook integration for alliance leaders

#### 8. 📈 Analytics Dashboard
- Server power rankings and trends
- Alliance comparison tools
- Historical tracking of your growth rate

---

## Monetization Model

```
Free Tier ──────► Premium ($4.99/mo) ──────► Alliance Pro ($14.99/mo)
│                 │                            │
├─ Basic timers   ├─ AI advisor                ├─ Manage 50+ members
├─ 1 account      ├─ Screenshot OCR            ├─ Advanced analytics
├─ Alliance chat  ├─ 5 accounts                ├─ Custom bot integrations
└─ Calculators    ├─ Advanced alerts            ├─ Priority support
                  └─ Analytics                  └─ White-label options
```

### Revenue Projections (Conservative)

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Free users | 50K | 200K | 500K |
| Paid conversion | 5% | 7% | 8% |
| Paying users | 2,500 | 14,000 | 40,000 |
| ARPU/mo | $6 | $7 | $8 |
| **MRR** | **$15K** | **$98K** | **$320K** |
| **ARR** | **$180K** | **$1.18M** | **$3.84M** |

---

## Competitive Landscape

| Competitor | What They Do | Gap |
|-----------|-------------|-----|
| Discord bots (various) | Basic event reminders | Fragmented, no game-specific intelligence |
| Game-specific wikis/guides | Static info | No personalization, no tracking |
| Gray-market bot services | Full automation | Illegal, unsustainable, no app store presence |
| Generic gaming companions | Multi-game but shallow | Not deep enough for serious players |

**Your edge:** A **dedicated, deep companion** for the Last War / Last Z genre that combines community tools + AI-powered strategy — something that doesn't exist today in a polished, legitimate form.

---

## Tech Stack Recommendation

| Layer | Technology | Why |
|-------|-----------|-----|
| **Mobile App** | React Native or Flutter | Cross-platform, single codebase |
| **Backend** | Node.js + Firebase/Supabase | Fast to ship, real-time capabilities |
| **OCR Engine** | Google Vision API or Tesseract | Screenshot data extraction |
| **AI Advisor** | OpenAI API / Gemini | Strategy recommendations |
| **Notifications** | Firebase Cloud Messaging | Push alerts |
| **Web Dashboard** | Next.js | Alliance leaders, analytics |
| **Auth** | Firebase Auth | Social login, easy onboarding |

---

## Go-To-Market Strategy

### Phase 1: Community Seed (Month 1-2)
- Build an MVP: Timer dashboard + shield alerts + basic alliance tools
- Launch as a **free Discord bot** in top Last War/Last Z servers
- Collect feedback, build reputation

### Phase 2: App Launch (Month 3-4)
- Ship mobile app (iOS + Android) with free tier
- Content marketing: YouTube guides, Reddit posts, TikTok gameplay tips
- Partner with popular Last War content creators for promotion

### Phase 3: Monetize (Month 5-6)
- Introduce Premium tier with OCR + AI features
- Alliance Pro tier for alliance leaders managing large groups
- Referral program: "Invite 3 friends → get 1 month free"

### Phase 4: Expand (Month 7-12)
- Add support for additional games (Whiteout Survival, Age of Origins, etc.)
- Build API marketplace for community-created tools
- Explore B2B: sell anonymized engagement analytics back to game studios

---

## Key Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Game devs shut you down | Stay 100% ToS-compliant, never touch game APIs |
| Low conversion to paid | Ensure free tier is valuable enough to build habit |
| OCR accuracy issues | Start with a small set of supported screens, iterate |
| Competition from game devs building their own tools | Move fast, build community moat |
| Single-game dependency | Expand to genre (all 4X strategy games) by Phase 4 |

---

## Open Questions

1. **Which game to start with?** Last War (17M MAU, most data available) or Last Z (growing fast, less competition)?
2. **Mobile-first or Discord-first?** Discord bot is faster to MVP but limits reach. Mobile app is harder but stickier.
3. **Solo or team?** The OCR + AI features need significant engineering. Consider a technical co-founder or contractor.
4. **Funding approach?** Bootstrap with free tier → revenue, or seek seed funding for faster launch?
