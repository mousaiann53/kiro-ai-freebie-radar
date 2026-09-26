import { describe, expect, it } from 'vitest';
import type { Offer, OfferDraft } from '../types';
import { compareDeadlines, filterOffers, getOfferStatus, isValidDateKey, sortOffersByDeadline, toDateKey, validateOffer } from './offers';

const TODAY = new Date(2026, 8, 26); // 2026-09-26 local

function offer(partial: Partial<Offer>): Offer {
  return {
    id: 'x', title: 't', provider: 'p', category: 'api-credits', value: '', deadline: '',
    requirements: '', region: '', url: '', notes: '', ...partial,
  };
}

describe('toDateKey / isValidDateKey', () => {
  it('formats local dates', () => expect(toDateKey(TODAY)).toBe('2026-09-26'));
  it('rejects impossible dates and bad formats', () => {
    expect(isValidDateKey('2026-02-30')).toBe(false);
    expect(isValidDateKey('10/05/2026')).toBe(false);
    expect(isValidDateKey('')).toBe(false);
    expect(isValidDateKey('2028-02-29')).toBe(true);
  });
});

describe('getOfferStatus', () => {
  it('expired when deadline is before today', () => expect(getOfferStatus({ deadline: '2026-09-25' }, TODAY)).toBe('expired'));
  it('active on the deadline day', () => expect(getOfferStatus({ deadline: '2026-09-26' }, TODAY)).toBe('active'));
  it('active when in the future', () => expect(getOfferStatus({ deadline: '2027-01-01' }, TODAY)).toBe('active'));
  it('active when empty or invalid', () => {
    expect(getOfferStatus({ deadline: '' }, TODAY)).toBe('active');
    expect(getOfferStatus({ deadline: 'soon' }, TODAY)).toBe('active');
  });
});

describe('filterOffers', () => {
  const list = [
    offer({ id: 'a', category: 'free-trial', deadline: '2026-01-01' }),
    offer({ id: 'b', category: 'api-credits', deadline: '2027-01-01' }),
    offer({ id: 'c', category: 'free-trial', deadline: '' }),
  ];
  it('filters by category, keeping order', () =>
    expect(filterOffers(list, { category: 'free-trial', status: 'all' }, TODAY).map((o) => o.id)).toEqual(['a', 'c']));
  it('filters by status', () => {
    expect(filterOffers(list, { category: 'all', status: 'expired' }, TODAY).map((o) => o.id)).toEqual(['a']);
    expect(filterOffers(list, { category: 'all', status: 'active' }, TODAY).map((o) => o.id)).toEqual(['b', 'c']);
  });
  it('all/all returns everything; empty input returns []', () => {
    expect(filterOffers(list, { category: 'all', status: 'all' }, TODAY)).toHaveLength(3);
    expect(filterOffers([], { category: 'free-trial', status: 'active' }, TODAY)).toEqual([]);
  });
});

describe('compareDeadlines', () => {
  it('orders valid deadlines ascending', () => {
    expect(compareDeadlines('2026-01-01', '2027-05-01', 'asc')).toBeLessThan(0);
    expect(compareDeadlines('2027-05-01', '2026-01-01', 'asc')).toBeGreaterThan(0);
  });
  it('orders valid deadlines descending', () => {
    expect(compareDeadlines('2026-01-01', '2027-05-01', 'desc')).toBeGreaterThan(0);
    expect(compareDeadlines('2027-05-01', '2026-01-01', 'desc')).toBeLessThan(0);
  });
  it('treats equal valid deadlines as a tie in both directions', () => {
    expect(compareDeadlines('2026-01-01', '2026-01-01', 'asc')).toBe(0);
    expect(compareDeadlines('2026-01-01', '2026-01-01', 'desc')).toBe(0);
  });
  it('sorts empty/invalid deadlines last regardless of direction', () => {
    expect(compareDeadlines('2026-01-01', '', 'asc')).toBeLessThan(0);
    expect(compareDeadlines('2026-01-01', '', 'desc')).toBeLessThan(0);
    expect(compareDeadlines('', '2026-01-01', 'asc')).toBeGreaterThan(0);
    expect(compareDeadlines('', '2026-01-01', 'desc')).toBeGreaterThan(0);
    expect(compareDeadlines('tbd', '2026-01-01', 'asc')).toBeGreaterThan(0);
  });
  it('treats two undated/invalid deadlines as a tie', () => {
    expect(compareDeadlines('', '', 'asc')).toBe(0);
    expect(compareDeadlines('tbd', '', 'desc')).toBe(0);
    expect(compareDeadlines('bad', 'nope', 'asc')).toBe(0);
  });
});

describe('sortOffersByDeadline', () => {
  const list = [
    offer({ id: 'none', deadline: '' }),
    offer({ id: 'late', deadline: '2027-05-01' }),
    offer({ id: 'bad', deadline: 'tbd' }),
    offer({ id: 'early', deadline: '2026-01-01' }),
  ];
  it('ascending with undated last', () =>
    expect(sortOffersByDeadline(list, 'asc').map((o) => o.id)).toEqual(['early', 'late', 'none', 'bad']));
  it('descending with undated last', () =>
    expect(sortOffersByDeadline(list, 'desc').map((o) => o.id)).toEqual(['late', 'early', 'none', 'bad']));
  it('does not mutate input and handles empty', () => {
    const copy = [...list];
    sortOffersByDeadline(list);
    expect(list).toEqual(copy);
    expect(sortOffersByDeadline([])).toEqual([]);
  });
});

describe('validateOffer', () => {
  const valid: OfferDraft = { ...offer({}), title: 'Credits', provider: 'Acme' };
  it('accepts a valid draft', () => expect(validateOffer(valid)).toEqual({}));
  it('requires title and provider, checks url and deadline', () => {
    const errors = validateOffer({ ...valid, title: ' ', provider: '', url: 'ftp://x', deadline: '2026-13-01' });
    expect(Object.keys(errors).sort()).toEqual(['deadline', 'provider', 'title', 'url']);
  });
});
