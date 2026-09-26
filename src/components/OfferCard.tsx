import { CATEGORY_LABELS } from '../types';
import type { Offer, OfferStatus } from '../types';

interface OfferCardProps {
  offer: Offer;
  status: OfferStatus;
  onEdit: (offer: Offer) => void;
  onDelete: (offer: Offer) => void;
}

export function OfferCard({ offer, status, onEdit, onDelete }: OfferCardProps) {
  return (
    <article className={`offer-card ${status}`}>
      <header>
        <h3>{offer.title}</h3>
        <span className={`badge ${status}`}>{status === 'active' ? 'Active' : 'Expired'}</span>
      </header>
      <p className="meta">
        {offer.provider} · {CATEGORY_LABELS[offer.category]}
        {offer.region && ` · ${offer.region}`}
      </p>
      <dl>
        {offer.value && (
          <>
            <dt>Value</dt>
            <dd>{offer.value}</dd>
          </>
        )}
        <dt>Deadline</dt>
        <dd>{offer.deadline || 'No deadline'}</dd>
        {offer.requirements && (
          <>
            <dt>Requirements</dt>
            <dd>{offer.requirements}</dd>
          </>
        )}
        {offer.notes && (
          <>
            <dt>Notes</dt>
            <dd>{offer.notes}</dd>
          </>
        )}
      </dl>
      <div className="actions">
        {offer.url && (
          <a href={offer.url} target="_blank" rel="noopener noreferrer">
            Open link
          </a>
        )}
        <button type="button" onClick={() => onEdit(offer)}>
          Edit
        </button>
        <button type="button" className="danger" onClick={() => onDelete(offer)}>
          Delete
        </button>
      </div>
    </article>
  );
}
