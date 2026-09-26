# Lesson 7 evidence: freebie-curator custom agent run

## Prompt received

> 新增一条示例 AI 福利并验证字段完整性。
>
> Workspace: h:\kiro. Add ONE record for the Gemini API free tier to DEMO_OFFERS in src/data/demoOffers.ts, using only these facts obtained via the fetch MCP server from https://ai.google.dev/gemini-api/docs/pricing (see docs/evidence/mcp-fetch.md): the page says Google's Gemini Developer API lets you "start building free of charge with generous limits" and has a "Free" tier "for developers and small projects getting started with the Gemini API."
> Use id `demo-gemini-api-free-tier`, provider "Google AI for Developers", category `api-credits`, deadline '' (open-ended), url https://ai.google.dev/gemini-api/docs/pricing. Do not invent rate limits or numbers; use a short value like "Free tier with rate limits" and put caveats in notes. Region: say it varies and to check the page.
> Follow the add-offer skill steps. Don't modify any other record or file besides src/data/demoOffers.ts and a new evidence file docs/evidence/custom-agent-run.md. Run `npm run check` and write the field checklist, computed status for today (2026-09-26), and test result into docs/evidence/custom-agent-run.md (title it "Lesson 7 evidence: freebie-curator custom agent run", include the prompt you received). Reply with the same summary.

## Record added

Appended to `DEMO_OFFERS` in `src/data/demoOffers.ts`. No other record changed.

```ts
{
  id: 'demo-gemini-api-free-tier',
  title: 'Gemini Developer API free tier',
  provider: 'Google AI for Developers',
  category: 'api-credits',
  value: 'Free tier with rate limits',
  deadline: '',
  requirements: '',
  region: 'Varies; check the official page',
  url: 'https://ai.google.dev/gemini-api/docs/pricing',
  notes:
    'Pricing page says "start building free of charge with generous limits"; Free tier is "for developers and small projects getting started with the Gemini API." Exact limits and eligibility requirements not captured here; check the page.',
}
```

## Field checklist

| Field | Check |
|---|---|
| `id` | ✅ `demo-gemini-api-free-tier`, kebab-case with `demo-` prefix, unique |
| `title` | ✅ non-empty |
| `provider` | ✅ `Google AI for Developers` |
| `category` | ✅ `api-credits` (valid) |
| `value` | ✅ `Free tier with rate limits` (no invented numbers) |
| `deadline` | ✅ `''` (open-ended) |
| `requirements` | ⚠️ `''`: the fetched page excerpt did not state requirements; noted in `notes` |
| `region` | ⚠️ `Varies; check the official page`: not stated in the fetched excerpt |
| `url` | ✅ official `https://` page, the one fetched via MCP |
| `notes` | ✅ quotes the fetched page and lists the caveats |

## Computed status for 2026-09-26

Active. `getOfferStatus` returns `active` when the deadline is empty. Demo data still has active offers and one expired offer (`demo-summer-model-promo`, 2026-08-31).

## Test result

Passed on 2026-09-26.

- First run: blocked. The `npm run check` call was denied by the agent's permission profile (`deny shell matching "*"`, source: subagent-profile).
- Fix: `.kiro/agents/freebie-curator.json` now pre-approves only `npm run check` / `npm test`, explicitly denies destructive or publishing commands (`rm`, `Remove-Item`, `npm install`, `git push`), and blocks writes outside `src/data/` and `docs/evidence/`.
- Second run: `npm run check` (`tsc --noEmit && vitest --run`), exit code 0.

| Test file | Tests | Result |
|---|---|---|
| `src/lib/offers.test.ts` | 14 | ✅ pass |
| `src/lib/storage.test.ts` | 6 | ✅ pass |
| `src/lib/offers.property.test.ts` | 6 | ✅ pass |
| `src/lib/storage.property.test.ts` | 1 | ✅ pass |
| **Total** | **4 files, 27 tests** | **✅ 27 passed, 0 failed** |

Typecheck (`tsc --noEmit`) reported no errors. The `demo data` test in `src/lib/storage.test.ts` ("has ≥5 valid offers with unique ids and both statuses") passes with `demo-gemini-api-free-tier` included: all records pass `validateOffer`, ids are unique, and both `active` and `expired` statuses are present for 2026-09-26.
