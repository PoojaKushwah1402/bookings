import { v4 as uuid } from 'uuid';
import type { StayBooking, StayBookingPayload } from './types';

const STORAGE_KEY = 'booking_host_stays';
const isBrowser = typeof window !== 'undefined';
const inMemory: StayBooking[] = [];

const hydrate = (): StayBooking[] => {
  if (!isBrowser) return inMemory;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return inMemory;
  try {
    const parsed = JSON.parse(raw) as StayBooking[];
    return Array.isArray(parsed) ? parsed : inMemory;
  } catch {
    return inMemory;
  }
};

const persist = (items: StayBooking[]) => {
  if (!isBrowser) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const checkoutApi = {
  async list(): Promise<StayBooking[]> {
    return hydrate();
  },

  async create(payload: StayBookingPayload): Promise<StayBooking> {
    const existing = hydrate();
    const booking: StayBooking = {
      id: uuid(),
      status: 'booked',
      createdAt: new Date().toISOString(),
      ...payload,
    };
    const next = [...existing, booking];
    persist(next);
    return booking;
  },

  async cancel(id: string): Promise<void> {
    const current = hydrate();
    const next: StayBooking[] = current.map((stay) =>
      stay.id === id ? { ...stay, status: 'cancelled' as const } : stay,
    );
    persist(next);
  },
};

