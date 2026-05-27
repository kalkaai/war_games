Design the JSON schema for a game data file before building any page against it.

Data file to design: $ARGUMENTS

Follow this sequence:

## Step 1 — Research (parallel)
Launch two Explore agents simultaneously:
1. Fetch `https://lastz.stresswar.com` and any relevant sub-page to understand how this data is structured and displayed on the reference site
2. Read `web/data/` and `discord_bot/src/types/index.ts` to understand existing data patterns and type conventions already in use

## Step 2 — Design the schema
Produce a JSON schema that:
- Uses camelCase keys
- Formats large resource numbers as raw integers (not strings like "2.3G") — formatting happens in the component
- Includes a TypeScript interface alongside the JSON
- Has a sample of 2–3 entries showing the full structure
- Notes any fields that are optional vs required

## Step 3 — Output
Present:
1. The TypeScript interface to add to `web/types/index.ts`
2. The JSON structure with sample entries
3. A note on which fields need to be manually populated vs can be derived

Do NOT build the page component yet. Wait for confirmation that the schema is correct and the data file is populated.
