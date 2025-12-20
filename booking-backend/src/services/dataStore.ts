import { randomUUID } from "crypto";
import type { AuthSession, Booking, Listing, User } from "../types/domain";

type Store = {
    listings: Listing[];
    bookings: Booking[];
    users: User[];
    sessions: AuthSession[];
};

const store: Store = {
    listings: [],
    bookings: [],
    users: [],
    sessions: [],
};

export const dataStore = {
    listListings(): Listing[] {
        return [...store.listings];
    },
    saveListing(listing: Omit<Listing, "id">): Listing {
        const record: Listing = { ...listing, id: randomUUID() };
        store.listings.unshift(record);
        return record;
    },
    updateListing(id: string, patch: Partial<Omit<Listing, "id">>): Listing | null {
        const idx = store.listings.findIndex((l) => l.id === id);
        if (idx < 0) return null;
        const updated = { ...store.listings[idx], ...patch };
        store.listings[idx] = updated;
        return updated;
    },
    deleteListing(id: string): boolean {
        const before = store.listings.length;
        store.listings = store.listings.filter((l) => l.id !== id);
        store.bookings = store.bookings.filter((b) => b.listingId !== id);
        return store.listings.length < before;
    },
    findListing(id: string): Listing | null {
        return store.listings.find((l) => l.id === id) ?? null;
    },
    listBookings(): Booking[] {
        return [...store.bookings];
    },
    saveBooking(booking: Omit<Booking, "id" | "status">): Booking {
        const record: Booking = { ...booking, id: randomUUID(), status: "confirmed" };
        store.bookings.unshift(record);
        return record;
    },
    updateBooking(id: string, patch: Partial<Omit<Booking, "id">>): Booking | null {
        const idx = store.bookings.findIndex((b) => b.id === id);
        if (idx < 0) return null;
        const updated = { ...store.bookings[idx], ...patch };
        store.bookings[idx] = updated;
        return updated;
    },
    findBooking(id: string): Booking | null {
        return store.bookings.find((b) => b.id === id) ?? null;
    },
    createUser(user: Omit<User, "id">): User {
        const record: User = { ...user, id: randomUUID() };
        store.users.push(record);
        return record;
    },
    findUserByEmail(email: string): User | null {
        return store.users.find((u) => u.email === email) ?? null;
    },
    createSession(user: User): AuthSession {
        const session: AuthSession = { token: randomUUID(), user };
        store.sessions.push(session);
        return session;
    },
    deleteSession(token: string): void {
        store.sessions = store.sessions.filter((s) => s.token !== token);
    },
    findSession(token: string): AuthSession | null {
        return store.sessions.find((s) => s.token === token) ?? null;
    },
};



