import { CATEGORIES } from '../types';
import type { Offer, OfferDraft, OfferErrors, OfferFilter, OfferStatus, SortDirection } from '../types';

const DATE_KEY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Local calendar date as 'YYYY-MM-DD' (used for all deadline comparisons). */
export function toDateKey(date: Date): string {
  const y = String(date.getFullYear()).padStart(4, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** True when value is a real calendar date in 'YYYY-MM-DD' form. */
export function isValidDateKey(value: string): boolean {
  const match = DATE_KEY.exec(value);
  if (!match) return false;
  const [, y, m, d] = match.map(Number) as [number, number, number, number];
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

/** Req 1: expired only when a valid deadline is strictly before today. */
export function getOfferStatus(offer: Pick<Offer, 'deadline'>, today: Date): OfferStatus {
  if (!isValidDateKey(offer.deadline)) return 'active';
  return offer.deadline < toDateKey(today) ? 'expired' : 'active';
}

/** Req 2: category + status filter. Preserves order, never mutates input. */
export function filterOffers(offers: readonly Offer[], filter: OfferFilter, today: Date): Offer[] {
  return offers.filter(
    (offer) =>
      (filter.category === 'all' || offer.category === filter.category) &&
      (filter.status === 'all' || getOfferStatus(offer, today) === filter.status),
  );
}

/** Req 3: sort by deadline; empty/invalid deadlines always last. Returns a new array. */
export function sortOffersByDeadline(offers: readonly Offer[], direction: SortDirection = 'asc'): Offer[] {
  const sign = direction === 'asc' ? 1 : -1;
  return [...offers].sort((a, b) => {
    const aValid = isValidDateKey(a.deadline);
    const bValid = isValidDateKey(b.deadline);
    if (!aValid || !bValid) return Number(!aValid) - Number(!bValid);
    if (a.deadline === b.deadline) return 0;
    return (a.deadline < b.deadline ? -1 : 1) * sign;
  });
}

/** Req 4.2: returns field → message for every invalid field (empty object = valid). */
export function validateOffer(draft: OfferDraft): OfferErrors {
  const errors: OfferErrors = {};
  if (!draft.title.trim()) errors.title = 'Title is required.';
  if (!draft.provider.trim()) errors.provider = 'Provider is required.';
  if (!(CATEGORIES as readonly string[]).includes(draft.category)) errors.category = 'Choose a category.';
  if (draft.deadline && !isValidDateKey(draft.deadline)) errors.deadline = 'Use a valid date (YYYY-MM-DD).';
  if (draft.url && !/^https?:\/\/\S+$/i.test(draft.url.trim())) errors.url = 'URL must start with http:// or https://';
  return errors;
}
