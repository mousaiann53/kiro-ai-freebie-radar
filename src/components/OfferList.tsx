import type { Offer } from '../types';
import { getOfferStatus } from '../lib/offers';
import { OfferCard } from './OfferCard';

interface OfferListProps {
  offers: readonly Offer[];
  today: Date;
  onEdit: (offer: Offer) => void;
  onDelete: (offer: Offer) => void;
}

export function OfferList({ offers, today, onEdit, onDelete }: OfferListProps) {
  if (offers.length === 0) {
    return <p className="empty">No offers match these filters.</p>;
  }
  return (
    <div className="offer-list">
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          status={getOfferStatus(offer, today)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
