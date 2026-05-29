Scaffold a Claude API route handler for the GAMIDES web app.

Route purpose: $ARGUMENTS

## Step 1 — Read existing structure
Read `web/app/api/` to understand the existing route patterns before creating a new one.

## Step 2 — Identify the route type
Determine which pattern applies:
- **Chat with streaming** — multi-turn conversation, real-time text display
- **Structured extraction** — screenshot analysis, data extraction (no streaming needed)
- **Simple Q&A** — single question, single answer

## Step 3 — Build the route handler

### For chat with streaming:
- Use `@anthropic-ai/sdk` with `claude-opus-4-6`
- `thinking: { type: "adaptive" }` and `output_config: { effort: "medium" }`
- Streaming via `ReadableStream` returning Server-Sent Events
- Tool use for game data lookups (read from `/data/*.json` — never pass full files in system prompt)
- Prompt caching on the system prompt with `cache_control: { type: "ephemeral", ttl: "1h" }`
- Error handling for `Anthropic.RateLimitError` only — do not catch generic errors silently
- Player timer context injected into the last user message if provided

### For structured extraction (screenshot analysis):
- Use `claude-opus-4-6` with `client.messages.parse()`
- `zodOutputFormat` with a Zod schema for the expected structure
- No streaming — fast synchronous response
- Vision input via base64 from FormData

### For simple Q&A:
- Consider routing simple pattern-matched queries to `claude-haiku-4-5` (10× cheaper)
- Only use Opus for queries that need reasoning or game strategy

## Step 4 — Build the frontend hook
Create a matching `use[FeatureName].ts` hook in `web/components/` that:
- Calls the route
- Handles the SSE stream (if streaming)
- Exposes `{ messages, send, streaming }` (for chat) or `{ result, analyze, loading }` (for extraction)

## Step 5 — Validate
- Confirm no full game data files are passed in the system prompt (use tools instead)
- Confirm `ANTHROPIC_API_KEY` is read from `process.env` — never hardcoded
- Confirm rate limit errors surface to the user rather than failing silently
