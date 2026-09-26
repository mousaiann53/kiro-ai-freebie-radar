import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { CATEGORIES } from '../types';
import type { Offer } from '../types';
import { toDateKey } from './offers';
import { parseStoredOffers } from './storage';

const deadlineArb = fc.oneof(
  fc.date({ min: new Date(2000, 0, 1), max: new Date(2099, 11, 31), noInvalidDate: true }).map(toDateKey),
  fc.constant(''),
);

const offerArb: fc.Arbitrary<Offer> = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1 }),
  provider: fc.string({ minLength: 1 }),
  category: fc.constantFrom(...CATEGORIES),
  value: fc.string(),
  deadline: deadlineArb,
  requirements: fc.string(),
  region: fc.string(),
  url: fc.oneof(fc.constant(''), fc.webUrl()),
  notes: fc.string(),
});

function throwsOnParse(raw: string): boolean {
  try {
    JSON.parse(raw);
    return false;
  } catch {
    return true;
  }
}

describe('storage properties', () => {
  // Feature: ai-freebie-radar, Property 7: Storage round trip
  // Validates: Requirements 5.1, 5.3, 5.4
  it('Property 7: storage round trip', () => {
    fc.assert(
      fc.property(fc.array(offerArb, { maxLength: 20 }), (offers) => {
        expect(parseStoredOffers(JSON.stringify(offers))).toEqual(offers);
      }),
      { numRuns: 100 },
    );

    const rawArb = fc.oneof(fc.string(), fc.string().map((s) => `{${s}`), fc.string().map((s) => `[${s}`));
    fc.assert(
      fc.property(rawArb, (raw) => {
        const parse = () => parseStoredOffers(raw);
        expect(parse).not.toThrow();
        if (throwsOnParse(raw)) expect(parse()).toBeNull();
      }),
      { numRuns: 100 },
    );
  });
});
