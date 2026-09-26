import { useEffect, useState } from 'react';
import type { Offer, OfferDraft } from '../types';
import { DEMO_OFFERS } from '../data/demoOffers';
import { loadOffers, saveOffers } from '../lib/storage';

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `offer-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Offer list state with localStorage persistence (Req 4, 5, 6). */
export function useOffers() {
  const [offers, setOffers] = useState<Offer[]>(() => loadOffers(window.localStorage));

  useEffect(() => {
    saveOffers(window.localStorage, offers);
  }, [offers]);

  return {
    offers,
    add: (draft: OfferDraft) => setOffers((list) => [{ ...draft, id: newId() }, ...list]),
    update: (offer: Offer) => setOffers((list) => list.map((o) => (o.id === offer.id ? offer : o))),
    remove: (id: string) => setOffers((list) => list.filter((o) => o.id !== id)),
    resetDemo: () => setOffers([...DEMO_OFFERS]),
  };
}
