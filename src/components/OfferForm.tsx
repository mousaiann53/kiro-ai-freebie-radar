import { useState } from 'react';
import type { FormEvent } from 'react';
import { CATEGORIES, CATEGORY_LABELS } from '../types';
import type { Offer, OfferDraft, OfferErrors } from '../types';
import { validateOffer } from '../lib/offers';

interface OfferFormProps {
  initial?: Offer;
  onSubmit: (draft: OfferDraft) => void;
  onCancel: () => void;
}

const EMPTY: OfferDraft = {
  title: '',
  provider: '',
  category: 'api-credits',
  value: '',
  deadline: '',
  requirements: '',
  region: '',
  url: '',
  notes: '',
};

type TextField = Exclude<keyof OfferDraft, 'category' | 'notes'>;

const TEXT_FIELDS: { name: TextField; label: string; type?: string; placeholder?: string }[] = [
  { name: 'title', label: 'Title *', placeholder: 'Free API credits for new users' },
  { name: 'provider', label: 'Provider *', placeholder: 'OpenAI, Google, AWS…' },
  { name: 'value', label: 'Value', placeholder: '$300 credits' },
  { name: 'deadline', label: 'Deadline', type: 'date' },
  { name: 'requirements', label: 'Requirements', placeholder: 'New account, student email…' },
  { name: 'region', label: 'Region', placeholder: 'Global' },
  { name: 'url', label: 'URL', type: 'url', placeholder: 'https://…' },
];

export function OfferForm({ initial, onSubmit, onCancel }: OfferFormProps) {
  const [draft, setDraft] = useState<OfferDraft>(() => {
    if (!initial) return EMPTY;
    const { id: _id, ...rest } = initial;
    return rest;
  });
  const [errors, setErrors] = useState<OfferErrors>({});

  const set = <K extends keyof OfferDraft>(key: K, value: OfferDraft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateOffer(draft);
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit({ ...draft, url: draft.url.trim() });
  };

  return (
    <form className="offer-form" onSubmit={handleSubmit} noValidate>
      <h2>{initial ? 'Edit offer' : 'New offer'}</h2>
      {TEXT_FIELDS.map(({ name, label, type, placeholder }) => (
        <label key={name}>
          {label}
          <input
            type={type ?? 'text'}
            value={draft[name]}
            placeholder={placeholder}
            aria-invalid={Boolean(errors[name])}
            aria-describedby={errors[name] ? `${name}-error` : undefined}
            onChange={(e) => set(name, e.target.value)}
          />
          {errors[name] && (
            <span id={`${name}-error`} className="error" role="alert">
              {errors[name]}
            </span>
          )}
        </label>
      ))}
      <label>
        Category *
        <select value={draft.category} onChange={(e) => set('category', e.target.value as OfferDraft['category'])}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </label>
      <label>
        Notes
        <textarea rows={2} value={draft.notes} onChange={(e) => set('notes', e.target.value)} />
      </label>
      <div className="actions">
        <button type="submit" className="primary">
          {initial ? 'Save changes' : 'Add offer'}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
