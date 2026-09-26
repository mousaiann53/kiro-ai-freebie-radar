import { useState } from 'react';
import type { Offer, OfferFilter, SortDirection } from './types';
import { filterOffers, getOfferStatus, sortOffersByDeadline } from './lib/offers';
import { useOffers } from './hooks/useOffers';
import { FilterBar } from './components/FilterBar';
import { OfferForm } from './components/OfferForm';
import { OfferList } from './components/OfferList';

type Editing = { mode: 'closed' } | { mode: 'new' } | { mode: 'edit'; offer: Offer };

export default function App() {
  const { offers, add, update, remove, resetDemo } = useOffers();
  const [filter, setFilter] = useState<OfferFilter>({ category: 'all', status: 'all' });
  const [sort, setSort] = useState<SortDirection>('asc');
  const [editing, setEditing] = useState<Editing>({ mode: 'closed' });

  const today = new Date();
  const visible = sortOffersByDeadline(filterOffers(offers, filter, today), sort);
  const activeCount = offers.filter((o) => getOfferStatus(o, today) === 'active').length;

  const handleDelete = (offer: Offer) => {
    if (window.confirm(`Delete "${offer.title}"?`)) remove(offer.id);
  };

  const handleReset = () => {
    if (window.confirm('Replace all offers with the demo data?')) resetDemo();
  };

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1>📡 AI Freebie Radar</h1>
          <p>
            {activeCount} active · {offers.length - activeCount} expired · saved in your browser
          </p>
        </div>
        <div className="actions">
          <button type="button" className="primary" onClick={() => setEditing({ mode: 'new' })}>
            + New offer
          </button>
          <button type="button" onClick={handleReset}>
            Reset demo data
          </button>
        </div>
      </header>

      {editing.mode !== 'closed' && (
        <OfferForm
          key={editing.mode === 'edit' ? editing.offer.id : 'new'}
          initial={editing.mode === 'edit' ? editing.offer : undefined}
          onCancel={() => setEditing({ mode: 'closed' })}
          onSubmit={(draft) => {
            if (editing.mode === 'edit') update({ ...draft, id: editing.offer.id });
            else add(draft);
            setEditing({ mode: 'closed' });
          }}
        />
      )}

      <FilterBar filter={filter} sort={sort} onFilterChange={setFilter} onSortChange={setSort} />
      <p className="count" aria-live="polite">
        Showing {visible.length} of {offers.length}
      </p>
      <OfferList offers={visible} today={today} onEdit={(offer) => setEditing({ mode: 'edit', offer })} onDelete={handleDelete} />
    </main>
  );
}
