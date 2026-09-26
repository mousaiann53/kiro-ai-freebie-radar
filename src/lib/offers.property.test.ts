import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { CATEGORIES } from '../types';
import type { Offer, OfferFilter, OfferStatus } from '../types';
import { filterOffers, getOfferStatus, isValidDateKey, sortOffersByDeadline, toDateKey } from './offers';

const RUNS = { numRuns: 100 };

// Dates within 2000–2099; keys derived through toDateKey (local calendar).
const dateArb = fc.date({ min: new Date(2000, 0, 1), max: new Date(2099, 11, 31), noInvalidDate: true });
const validDeadlineArb = dateArb.map(toDateKey);
const invalidDeadlineArb = fc.oneof(
  fc.string().filter((s) => s !== '' && !isValidDateKey(s)),
  fc.constantFrom('2025-02-30', '2025-13-01', '10/5/26', 'soon'),
);
const deadlineArb = fc.oneof(validDeadlineArb, fc.constant(''), invalidDeadlineArb);
const categoryArb = fc.constantFrom(...CATEGORIES);

const offerArb: fc.Arbitrary<Offer> = fc.record({
  id: fc.uuid(),
  title: fc.string(),
  provider: fc.string(),
  category: categoryArb,
  value: fc.string(),
  deadline: deadlineArb,
  requirements: fc.string(),
  region: fc.string(),
  url: fc.string(),
  notes: fc.string(),
});
const offersArb = fc.array(offerArb, { maxLength: 30 });
const filterArb: fc.Arbitrary<OfferFilter> = fc.record({
  category: fc.constantFrom<OfferFilter['category']>('all', ...CATEGORIES),
  status: fc.constantFrom<OfferStatus | 'all'>('all', 'active', 'expired'),
});

/** Local date shifted by `days` calendar days. */
function shiftDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** True when `sub` appears in `full` in the same relative order (by reference). */
function isSubsequence<T>(sub: readonly T[], full: readonly T[]): boolean {
  let i = 0;
  for (const item of full) if (i < sub.length && sub[i] === item) i++;
  return i === sub.length;
}

describe('offers properties', () => {
  // Feature: ai-freebie-radar, Property 1: Past deadlines are expired
  // Validates: Requirements 1.1
  it('Property 1: past deadlines are expired', () => {
    fc.assert(
      fc.property(dateArb, fc.integer({ min: 1, max: 3650 }), (today, offset) => {
        const deadline = toDateKey(shiftDays(today, -offset));
        expect(deadline < toDateKey(today)).toBe(true);
        expect(getOfferStatus({ deadline }, today)).toBe('expired');
      }),
      RUNS,
    );
  });

  // Feature: ai-freebie-radar, Property 2: Today, future, empty or invalid deadlines are active
  // Validates: Requirements 1.2, 1.3, 1.4
  it('Property 2: today, future, empty or invalid deadlines are active', () => {
    const deadlineFor = (today: Date): fc.Arbitrary<string> =>
      fc.oneof(
        fc.constant(toDateKey(today)),
        fc.integer({ min: 1, max: 3650 }).map((d) => toDateKey(shiftDays(today, d))),
        fc.constant(''),
        fc.string().filter((s) => !isValidDateKey(s)),
      );
    fc.assert(
      fc.property(
        dateArb.chain((today) => fc.tuple(fc.constant(today), deadlineFor(today))),
        ([today, deadline]) => {
          expect(getOfferStatus({ deadline }, today)).toBe('active');
        },
      ),
      RUNS,
    );
  });

  // Feature: ai-freebie-radar, Property 3: Category filter soundness and completeness
  // Validates: Requirements 2.1, 2.2
  it('Property 3: category filter soundness and completeness', () => {
    fc.assert(
      fc.property(offersArb, categoryArb, dateArb, (offers, category, today) => {
        const result = filterOffers(offers, { category, status: 'all' }, today);
        expect(result.every((o) => o.category === category)).toBe(true);
        for (const o of offers) if (o.category === category) expect(result).toContain(o);
      }),
      RUNS,
    );
  });

  // Feature: ai-freebie-radar, Property 4: Status filter and subset/order preservation
  // Validates: Requirements 2.3, 2.4, 2.5, 2.6
  it('Property 4: status filter and subset/order preservation', () => {
    fc.assert(
      fc.property(offersArb, filterArb, dateArb, (offers, filter, today) => {
        const result = filterOffers(offers, filter, today);
        for (const o of result) {
          if (filter.status !== 'all') expect(getOfferStatus(o, today)).toBe(filter.status);
          if (filter.category !== 'all') expect(o.category).toBe(filter.category);
        }
        expect(isSubsequence(result, offers)).toBe(true);
        expect(filterOffers(offers, { category: 'all', status: 'all' }, today)).toEqual(offers);
        expect(filterOffers([], filter, today)).toEqual([]);
      }),
      RUNS,
    );
  });

  // Feature: ai-freebie-radar, Property 5: Deadline sort is monotonic
  // Validates: Requirements 3.1, 3.2, 3.3
  it('Property 5: deadline sort is monotonic', () => {
    fc.assert(
      fc.property(offersArb, fc.constantFrom('asc' as const, 'desc' as const), (offers, direction) => {
        const sorted = sortOffersByDeadline(offers, direction);
        const validFlags = sorted.map((o) => isValidDateKey(o.deadline));
        const firstInvalid = validFlags.indexOf(false);
        if (firstInvalid !== -1) expect(validFlags.slice(firstInvalid).every((v) => !v)).toBe(true);
        const keys = sorted.filter((o) => isValidDateKey(o.deadline)).map((o) => o.deadline);
        for (let i = 1; i < keys.length; i++) {
          const [prev, cur] = [keys[i - 1] as string, keys[i] as string];
          expect(direction === 'asc' ? prev <= cur : prev >= cur).toBe(true);
        }
      }),
      RUNS,
    );
  });

  // Feature: ai-freebie-radar, Property 6: Sort is a non-mutating permutation
  // Validates: Requirements 3.4, 3.5
  it('Property 6: sort is a non-mutating permutation', () => {
    fc.assert(
      fc.property(offersArb, fc.constantFrom('asc' as const, 'desc' as const), (offers, direction) => {
        const snapshot = structuredClone(offers);
        const order = [...offers];
        const sorted = sortOffersByDeadline(offers, direction);
        expect(sorted).not.toBe(offers);
        expect(sorted).toHaveLength(offers.length);
        expect(sorted.map((o) => o.id).sort()).toEqual(offers.map((o) => o.id).sort());
        expect(offers).toEqual(snapshot);
        expect(offers.every((o, i) => o === order[i])).toBe(true);
        expect(sortOffersByDeadline([], direction)).toEqual([]);
      }),
      RUNS,
    );
  });
});
