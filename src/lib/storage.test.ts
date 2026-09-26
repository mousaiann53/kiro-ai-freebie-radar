import { describe, expect, it } from 'vitest';
import { DEMO_OFFERS } from '../data/demoOffers';
import { getOfferStatus, validateOffer } from './offers';
import { STORAGE_KEY, loadOffers, parseStoredOffers, saveOffers } from './storage';

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
  };
}

describe('storage', () => {
  it('round-trips offers', () => {
    const storage = memoryStorage();
    saveOffers(storage, DEMO_OFFERS);
    expect(loadOffers(storage)).toEqual(DEMO_OFFERS);
  });
  it('falls back to demo data when missing or corrupt', () => {
    expect(loadOffers(memoryStorage())).toEqual(DEMO_OFFERS);
    expect(loadOffers(memoryStorage({ [STORAGE_KEY]: '{not json' }))).toEqual(DEMO_OFFERS);
    expect(parseStoredOffers('{"a":1}')).toBeNull();
  });
  it('drops malformed records', () => {
    expect(parseStoredOffers(JSON.stringify([{ id: 1 }, DEMO_OFFERS[0]]))).toEqual([DEMO_OFFERS[0]]);
  });
  it('keeps an empty saved list (user deleted everything)', () => {
    expect(loadOffers(memoryStorage({ [STORAGE_KEY]: '[]' }))).toEqual([]);
  });
  it('survives a throwing storage', () => {
    const broken = { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('quota'); } };
    expect(loadOffers(broken)).toEqual(DEMO_OFFERS);
    expect(() => saveOffers(broken, DEMO_OFFERS)).not.toThrow();
  });
});

describe('demo data', () => {
  const today = new Date(2026, 8, 26);
  it('has ≥5 valid offers with unique ids and both statuses', () => {
    expect(DEMO_OFFERS.length).toBeGreaterThanOrEqual(5);
    expect(new Set(DEMO_OFFERS.map((o) => o.id)).size).toBe(DEMO_OFFERS.length);
    for (const { id: _id, ...draft } of DEMO_OFFERS) expect(validateOffer(draft)).toEqual({});
    const statuses = new Set(DEMO_OFFERS.map((o) => getOfferStatus(o, today)));
    expect(statuses).toEqual(new Set(['active', 'expired']));
  });
});
