---
inclusion: fileMatch
fileMatchPattern: "src/{types.ts,data/**}"
---

# Offer data rules

Apply these whenever you add or edit offers (for example in `src/data/demoOffers.ts`), so that demo data is complete and the status logic can be demonstrated.

- Every offer has all fields: `id`, `title`, `provider`, `category`, `value`, `deadline`, `requirements`, `region`, `url`, `notes`. Use `''` instead of omitting a field.
- `id` is unique kebab-case, e.g. `demo-gcp-free-trial`.
- `category` must be one of `api-credits`, `free-trial`, `early-access`, `student-dev`, `model-event`, `tool-discount`.
- `deadline` is `YYYY-MM-DD` or `''` for open-ended.
- `url` is an official `https://` page from the provider. Never invent URLs; if unsure, use the provider's homepage and say so in `notes`.
- `value` is short and human readable (`"$300 credits"`, `"3 months free"`).
- Demo data must keep at least one active and one expired offer.
- Never put API keys, referral codes or personal data in offers.

```ts
// ✅ Good
{
  id: 'demo-example-credits',
  title: 'Starter API credits',
  provider: 'Example AI',
  category: 'api-credits',
  value: '$5 credits',
  deadline: '',
  requirements: 'New account, phone verification',
  region: 'Global',
  url: 'https://example.com/pricing',
  notes: 'Terms change often; check before relying on it.',
}

// ❌ Bad — missing fields, invalid category, non-ISO date
{ title: 'Free stuff', category: 'credits', deadline: '10/5/26' }
```
