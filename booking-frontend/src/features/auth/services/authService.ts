import type {Credentials, User, Session} from "../types";
import {httpClient} from "../../../shared/api/httpClient";

const STORAGE_KEY = "booking_host_user";
const isBrowser = typeof window !== "undefined";
let session: Session | null = null;

const persist = (value: Session | null) => {
    session = value;
    if (!isBrowser) return;
    if (!value) {
        window.localStorage.removeItem(STORAGE_KEY);
        return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
};

const read = (): Session | null => {
    if (session) return session;
    if (!isBrowser) return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw) as Session;
        session = parsed;
        return parsed;
    } catch {
        return null;
    }
};

export const authService = {
    async currentSession(): Promise<Session | null> {
        return read();
    },
    async signIn(credentials: Credentials): Promise<Session> {
        const payload = {
            name: credentials.name.trim(),
            email: credentials.email.trim().toLowerCase(),
            password: credentials.password
        };
        // Simplify: register acts as sign-in for now. Swap to /auth/login when you want separation.
        const session = await httpClient.post<Session>(
            "/auth/register",
            payload
        );
        persist(session);
        return session;
    },
    async signOut(token?: string): Promise<void> {
        await httpClient.post("/auth/logout", {}, token);
        persist(null);
    }
};
