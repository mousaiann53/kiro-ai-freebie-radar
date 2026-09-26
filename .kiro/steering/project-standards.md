---
inclusion: always
---

# AI Freebie Radar — Project Standards

This is a Kiro University Challenge Final project. Every change must stay small, working and easy to demo in under 3 minutes. When in doubt, choose the simpler option.

## 1. TypeScript strict, no `any`

Enforce `"strict": true` and never use `any`, so that the compiler catches bad offer data before it reaches the UI.

```ts
// ✅ Good
export function getOfferStatus(offer: Pick<Offer, 'deadline'>, today: Date): OfferStatus { ... }

// ❌ Bad
export function getOfferStatus(offer: any, today?: any) { ... }
```

## 2. Business logic lives in pure functions under `src/lib/`

Status, filtering, sorting, validation and storage parsing are pure functions with injected inputs (`today: Date`, `storage: Storage`), so that they can be property-tested and reused. Components never compute these rules inline.

```tsx
// ✅ Good — component calls pure functions
const visible = sortOffersByDeadline(filterOffers(offers, filter, today), sortDir);

// ❌ Bad — rule duplicated inside JSX, reads the clock implicitly
{offers.filter(o => new Date(o.deadline) > new Date()).map(...)}
```

Pure functions must not mutate their inputs:

```ts
// ✅ Good
return [...offers].sort(compare);

// ❌ Bad — mutates caller's array
return offers.sort(compare);
```

## 3. Small, focused components

One component per file in `src/components/`, ideally under ~120 lines, props typed with an interface. Components render and forward events; state lives in `useOffers` and `App`.

```tsx
// ✅ Good
interface OfferCardProps { offer: Offer; status: OfferStatus; onEdit: (o: Offer) => void; onDelete: (id: string) => void }

// ❌ Bad — one 500-line App.tsx doing storage, validation and rendering
```

## 4. No unnecessary dependencies, no backend

Runtime dependencies are limited to `react` and `react-dom`. Dev tooling (vite, vitest, fast-check, typescript) is fine. Do not add state libraries (Redux, Zustand), UI kits, date libraries, routers, databases, auth, servers, cloud deploys, payments or AI chat. Persistence is `localStorage` only.

```ts
// ✅ Good
localStorage.setItem(STORAGE_KEY, JSON.stringify(offers));

// ❌ Bad
import { createClient } from '@supabase/supabase-js';
import dayjs from 'dayjs';
```

## 5. Mobile-friendly, simple, accessible UI

Single column below 720px, plain CSS in `src/index.css`, every input has a `<label>`, status is shown as text ("Active"/"Expired") not color alone, buttons have clear text.

## 6. Tests and verification

- Unit tests next to the code: `src/lib/*.test.ts` (Vitest).
- Property tests: `src/lib/*.property.test.ts` (fast-check), ≥100 runs each.
- Before finishing any task run `npm run check` (typecheck + tests).

## 7. Demo first

Prefer features that are visible in the demo (create, edit, delete, filter, sort, expired badge, reload persistence). Do not add features the spec in `.kiro/specs/ai-freebie-radar/` does not ask for.
