import { dataStore } from "./dataStore";
import type { AuthSession, User } from "../types/domain";

export type RegisterInput = {
    name: string;
    email: string;
    password: string;
};

export type LoginInput = {
    email: string;
    password: string;
};

export const authService = {
    async register(input: RegisterInput): Promise<AuthSession> {
        const existing = dataStore.findUserByEmail(input.email);
        if (existing) {
            throw new Error("User already exists");
        }
        const user: User = dataStore.createUser({
            name: input.name.trim(),
            email: input.email.trim().toLowerCase(),
        });
        return dataStore.createSession(user);
    },
    async login(input: LoginInput): Promise<AuthSession> {
        const user = dataStore.findUserByEmail(input.email.trim().toLowerCase());
        if (!user) {
            throw new Error("Invalid credentials");
        }
        return dataStore.createSession(user);
    },
    async logout(token: string): Promise<void> {
        dataStore.deleteSession(token);
    },
    async current(token: string): Promise<AuthSession | null> {
        return dataStore.findSession(token);
    },
};

