Sync shared types between the Discord bot and the web app.

Read both type files and reconcile them:
- `discord_bot/src/types/index.ts` — source of truth
- `web/types/index.ts` — should mirror the bot's types relevant to the web

## What to sync
- `TimerType` enum — must be identical in both
- `TimerDoc`, `AccountDoc`, `UserDoc` interfaces — web version should match bot version
- `GamePreset` interface — must match `gamePresets.json` structure

## What NOT to sync
- Discord-specific types (interaction types, embed builders, command definitions)
- Bot-only service types (anything in discord_bot/src/services/)
- Admin SDK types (Firebase Admin is bot-only; web uses Firebase client SDK)

## Output
1. List any types that differ between the two files
2. Show the exact changes needed in `web/types/index.ts` to bring it in sync
3. Apply the changes

Do not modify `discord_bot/src/types/index.ts` — the bot is the source of truth.
