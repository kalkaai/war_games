Debug a runtime issue in the GAMIDES web app.

Issue description: $ARGUMENTS

## Step 1 — Classify the error

Based on the description, identify the category:

- **Data error** — page renders but shows wrong values, missing entries, or "undefined"
- **Type error** — TypeScript complaint or runtime "cannot read property of undefined"
- **Import error** — module not found, bad path, or circular dependency
- **Render error** — component crashes, blank page, or hydration mismatch
- **State error** — localStorage not persisting, wrong value after interaction
- **API error** — Claude API route returns 4xx/5xx or stream breaks

## Step 2 — Trace the data flow

Read the component or route mentioned in the issue. Follow the data from source to render:

1. **For page components**: `web/data/[file].json` → import → typed interface → component props → rendered output
2. **For API routes**: request body → validation → Anthropic SDK call → stream/response → client

Identify exactly where the value diverges from expectation.

## Step 3 — Common fixes by category

**Data errors:**
- Check that the JSON import path is correct and the file exists
- Verify the TypeScript interface matches the JSON shape (extra fields cause no error; missing required fields do)
- Check that array `.find()` / `.filter()` calls have a fallback for undefined

**Type errors:**
- Check for optional chaining where needed (`obj?.field` not `obj.field`)
- Check that `JSON.parse()` results are cast to the correct type
- Verify `params` and `searchParams` in Next.js App Router are typed correctly

**Import errors:**
- Check that path aliases (`@/`) are configured in `tsconfig.json` `paths`
- Check for circular imports: A imports B, B imports A

**Render errors (hydration mismatch):**
- Check if the component uses `window` or `localStorage` directly without `typeof window !== 'undefined'` guard or a `useEffect`
- Any value that differs between server and client render will cause a hydration error

**State errors:**
- Check the exact `localStorage` key being read vs written (case-sensitive)
- Check that `JSON.stringify` / `JSON.parse` is used correctly on non-string values
- Check that `useEffect` dependencies are correct (missing dep = stale value)

**API errors:**
- Check that `ANTHROPIC_API_KEY` is set in the running environment
- Check that the request body is parsed before use (`await req.json()`)
- For streaming errors, check that `ReadableStream` is properly closed in the `cancel` callback

## Step 4 — Output

Provide:
1. Root cause (one sentence)
2. The exact file and line where the fix goes
3. The corrected code snippet

If the root cause cannot be determined from reading the code alone, list the 2–3 most likely causes and what to check for each.
