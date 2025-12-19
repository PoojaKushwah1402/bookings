import type { Credentials, User } from '../types';

const STORAGE_KEY = 'booking_host_user';
const isBrowser = typeof window !== 'undefined';
let sessionUser: User | null = null;

const persist = (user: User | null) => {
  sessionUser = user;
  if (!isBrowser) return;
  if (!user) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

const read = (): User | null => {
  if (sessionUser) return sessionUser;
  if (!isBrowser) return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as User;
    sessionUser = parsed;
    return parsed;
  } catch {
    return null;
  }
};

export const authService = {
  async currentUser(): Promise<User | null> {
    return read();
  },
  async signIn(credentials: Credentials): Promise<User> {
    const trimmed: User = {
      name: credentials.name.trim(),
      email: credentials.email.trim().toLowerCase(),
    };
    persist(trimmed);
    return trimmed;
  },
  async signOut(): Promise<void> {
    persist(null);
  },
};

