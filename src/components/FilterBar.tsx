import { CATEGORIES, CATEGORY_LABELS } from '../types';
import type { OfferFilter, SortDirection } from '../types';

interface FilterBarProps {
  filter: OfferFilter;
  sort: SortDirection;
  onFilterChange: (filter: OfferFilter) => void;
  onSortChange: (sort: SortDirection) => void;
}

export function FilterBar({ filter, sort, onFilterChange, onSortChange }: FilterBarProps) {
  return (
    <section className="filters" aria-label="Filter and sort">
      <label>
        Category
        <select
          value={filter.category}
          onChange={(e) => onFilterChange({ ...filter, category: e.target.value as OfferFilter['category'] })}
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </label>
      <label>
        Status
        <select
          value={filter.status}
          onChange={(e) => onFilterChange({ ...filter, status: e.target.value as OfferFilter['status'] })}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
      </label>
      <label>
        Deadline order
        <select value={sort} onChange={(e) => onSortChange(e.target.value as SortDirection)}>
          <option value="asc">Soonest first</option>
          <option value="desc">Latest first</option>
        </select>
      </label>
    </section>
  );
}
