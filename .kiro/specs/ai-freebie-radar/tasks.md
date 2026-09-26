# Implementation Plan: AI Freebie Radar

## Overview

Build a local-only React + TypeScript (strict) app that tracks AI perks. Pure business logic (status, filter, sort, validation, storage parsing) lives in `src/lib/`, state in the `useOffers` hook, rendering in small components, and persistence in localStorage. Tasks 1–6 are implemented and verified (`npm run check` and `npm run build` pass). Task 7 adds fast-check property tests for Properties 1–7 from `design.md`, and task 8 is the final verification.

## Tasks

- [x] 1. Scaffold project and core types
  - Create Vite + React + TypeScript (strict) project with Vitest
  - Define `Offer`, `OfferDraft`, `Category`, `OfferStatus`, `OfferFilter` and `CATEGORIES` in `src/types.ts`
  - _Requirements: 1, 2, 3_

- [x] 2. Implement pure offer logic
  - [x] 2.1 Implement `toDateKey`, `isValidDateKey` and `getOfferStatus` in `src/lib/offers.ts`
    - Compare `YYYY-MM-DD` strings; empty/invalid deadline → `active`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - [x] 2.2 Implement `filterOffers`
    - Category + status filter, preserves order, never mutates input
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  - [x] 2.3 Implement `sortOffersByDeadline`
    - asc/desc, empty/invalid deadlines last, returns new array
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [x] 2.4 Implement `validateOffer`
    - Required `title`, `provider`, valid category, `url` empty or http(s), deadline empty or valid date
    - _Requirements: 4.2_
  - [x] 2.5 Write unit tests for offer logic in `src/lib/offers.test.ts`
    - _Requirements: 1, 2, 3, 4.2_

- [x] 3. Implement persistence and demo data
  - [x] 3.1 Create `DEMO_OFFERS` (≥5 offers, at least one active and one expired) in `src/data/demoOffers.ts`
    - _Requirements: 6.1_
  - [x] 3.2 Implement `parseStoredOffers`, `loadOffers`, `saveOffers` in `src/lib/storage.ts`
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - [x] 3.3 Write unit tests for storage in `src/lib/storage.test.ts`
    - _Requirements: 5.3, 5.4_

- [x] 4. Implement `useOffers` hook
  - add / update / remove / resetDemo, persists on every change
  - _Requirements: 4.1, 4.3, 4.4, 5.1, 5.2, 6.2_

- [x] 5. Build UI components
  - [x] 5.1 `FilterBar` with category, status and sort direction selects
    - _Requirements: 2, 3, 7.2_
  - [x] 5.2 `OfferForm` for create/edit with inline validation
    - _Requirements: 4.1, 4.2, 4.3, 7.2_
  - [x] 5.3 `OfferCard` and `OfferList` with text status badge, edit and delete
    - _Requirements: 1, 4.4, 7.2_
  - [x] 5.4 Wire everything in `App.tsx`, mobile-first CSS
    - _Requirements: 6.2, 7.1_

- [x] 6. Checkpoint — build, typecheck and unit tests pass
  - Run `npm run check` and `npm run build`

- [x] 7. Property-based tests (run in Kiro IDE)
  - [x]* 7.1 Write property test for past deadlines
    - **Property 1: Past deadlines are expired**
    - **Validates: Requirements 1.1**
  - [x]* 7.2 Write property test for active deadlines
    - **Property 2: Today, future, empty or invalid deadlines are active**
    - **Validates: Requirements 1.2, 1.3, 1.4**
  - [x]* 7.3 Write property test for category filter
    - **Property 3: Category filter soundness and completeness**
    - **Validates: Requirements 2.1, 2.2**
  - [x]* 7.4 Write property test for status filter and order preservation
    - **Property 4: Status filter and subset/order preservation**
    - **Validates: Requirements 2.3, 2.4, 2.5, 2.6**
  - [x]* 7.5 Write property test for monotonic sort
    - **Property 5: Deadline sort is monotonic**
    - **Validates: Requirements 3.1, 3.2, 3.3**
  - [x]* 7.6 Write property test for non-mutating permutation
    - **Property 6: Sort is a non-mutating permutation**
    - **Validates: Requirements 3.4, 3.5**
  - [x]* 7.7 Write property test for storage round trip
    - **Property 7: Storage round trip**
    - **Validates: Requirements 5.1, 5.3, 5.4**

- [x] 8. Final checkpoint — all tests including property tests pass
  - Run `npm run check`
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Execution order is 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8. Tasks 1–6 are complete and verified.
- Task 7 sub-tasks are optional (`*`) and run through the Kiro IDE spec task flow. They go in `src/lib/offers.property.test.ts` (storage round trip may go in a storage property test), use fast-check with at least 100 runs each, and are tagged `Feature: ai-freebie-radar, Property N`.
- Sub-tasks 7.1–7.7 don't depend on each other logically. The graph below still puts them in separate waves because they write to the same test file, and parallel edits to one file would conflict.
- Before finishing any task, run `npm run check` (typecheck + tests).

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["7.1"] },
    { "id": 1, "tasks": ["7.2"] },
    { "id": 2, "tasks": ["7.3"] },
    { "id": 3, "tasks": ["7.4"] },
    { "id": 4, "tasks": ["7.5"] },
    { "id": 5, "tasks": ["7.6"] },
    { "id": 6, "tasks": ["7.7"] }
  ]
}
```
