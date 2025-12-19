import { v4 as uuid } from 'uuid';
import type { Listing, ListingPayload } from '../types';

const STORAGE_KEY = 'booking_host_listings';

const isBrowser = typeof window !== 'undefined';
const inMemoryStore: Listing[] = [];

const hydrate = (): Listing[] => {
  if (!isBrowser) return inMemoryStore;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return inMemoryStore;
  try {
    const parsed = JSON.parse(raw) as Listing[];
    return Array.isArray(parsed) ? parsed : inMemoryStore;
  } catch {
    return inMemoryStore;
  }
};

const persist = (items: Listing[]) => {
  if (!isBrowser) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const listingService = {
  async list(): Promise<Listing[]> {
    return hydrate();
  },

  async create(payload: ListingPayload): Promise<Listing> {
    const existing = hydrate();
    const listing: Listing = {
      id: uuid(),
      createdAt: new Date().toISOString(),
      isActive: true,
      ...payload,
    };
    const next = [...existing, listing];
    persist(next);
    return listing;
  },

  async remove(id: string): Promise<void> {
    const current = hydrate();
    const next = current.filter((item) => item.id !== id);
    persist(next);
  },
};

