# Cloud session: extract `compareDeadlines` helper

This is a test-heavy refactor with no behavior change, performed in a cloud sandbox.

## What ran in the sandbox

1. `npm install` — installed dev tooling (vite, vitest, fast-check, typescript). Runtime deps stay limited to `react` / `react-dom`.
2. `npm run check` (baseline) — `tsc --noEmit` typecheck plus `vitest --run`.
3. Refactor in `src/lib/offers.ts`: extracted the deadline comparison inside `sortOffersByDeadline` into a small exported pure helper:

   ```ts
   export function compareDeadlines(a: string, b: string, direction: SortDirection): number
   ```

   `sortOffersByDeadline` now delegates to `compareDeadlines` inside its `sort` callback. Behavior is identical: valid deadlines order by direction; empty/invalid deadlines always sort last regardless of direction; the function returns a new array and never mutates its input.
4. Added unit tests for `compareDeadlines` in `src/lib/offers.test.ts` (ascending, descending, equal-tie, undated/invalid-last, and two-undated-tie cases).
5. `npm run check` (final) — re-ran typecheck and tests.

## Test results

| Stage    | Test files | Tests |
| -------- | ---------- | ----- |
| Baseline | 4 passed   | 27 passed |
| Final    | 4 passed   | 32 passed |

Five new unit tests were added for `compareDeadlines`. No existing tests changed and no behavior changed; the existing `sortOffersByDeadline` tests continue to pass unmodified.

## Standards honored

- TypeScript strict, no `any`; reused the existing `SortDirection` type from `src/types.ts`.
- Business logic stays in a pure function under `src/lib/`; the helper does not mutate inputs.
- No new runtime dependencies added.
