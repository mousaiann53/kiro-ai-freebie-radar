import { CATEGORIES } from '../types';
import type { Offer } from '../types';
import { DEMO_OFFERS } from '../data/demoOffers';

export const STORAGE_KEY = 'ai-freebie-radar.offers.v1';

type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem'>;

const STRING_FIELDS = ['id', 'title', 'provider', 'value', 'deadline', 'requirements', 'region', 'url', 'notes'] as const;

function isOffer(value: unknown): value is Offer {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    STRING_FIELDS.every((field) => typeof record[field] === 'string') &&
    (CATEGORIES as readonly unknown[]).includes(record.category)
  );
}

/** Req 5.4: null when missing / invalid JSON / not an array; malformed records are dropped. */
export function parseStoredOffers(raw: string | null): Offer[] | null {
  if (raw === null) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return null;
    return data.filter(isOffer);
  } catch {
    return null;
  }
}

/** Req 5.3 / 6.1: stored list, or demo data on first run or corrupt storage. */
export function loadOffers(storage: KeyValueStorage): Offer[] {
  try {
    return parseStoredOffers(storage.getItem(STORAGE_KEY)) ?? [...DEMO_OFFERS];
  } catch {
    return [...DEMO_OFFERS];
  }
}

/** Req 5.1 / 5.2: write the full list; storage errors are ignored. */
export function saveOffers(storage: KeyValueStorage, offers: readonly Offer[]): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(offers));
  } catch {
    // Quota exceeded or private mode: keep working in memory.
  }
}
