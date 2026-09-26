export const CATEGORIES = [
  'api-credits',
  'free-trial',
  'early-access',
  'student-dev',
  'model-event',
  'tool-discount',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  'api-credits': 'API credits',
  'free-trial': 'Free trial',
  'early-access': 'Early access',
  'student-dev': 'Student / developer',
  'model-event': 'Limited-time model event',
  'tool-discount': 'AI tool discount',
};

export type OfferStatus = 'active' | 'expired';

export interface Offer {
  id: string;
  title: string;
  provider: string;
  category: Category;
  value: string;
  /** 'YYYY-MM-DD' or '' when open-ended */
  deadline: string;
  requirements: string;
  region: string;
  url: string;
  notes: string;
}

export type OfferDraft = Omit<Offer, 'id'>;

export interface OfferFilter {
  category: Category | 'all';
  status: OfferStatus | 'all';
}

export type SortDirection = 'asc' | 'desc';

export type OfferErrors = Partial<Record<keyof OfferDraft, string>>;
