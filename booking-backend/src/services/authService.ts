import type {AuthSession} from "../types/domain";
import {authRepo} from "../repositories/authRepo";
import {hashPassword, verifyPassword} from "../shared/password";

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
        const existing = await authRepo.findUserByEmail(input.email);
        if (existing) {
            throw new Error("User already exists");
        }
        const user = await authRepo.createUser({
            name: input.name.trim(),
            email: input.email.trim().toLowerCase(),
            role: "host",
            passwordHash: await hashPassword(input.password)
        });
        console.log(user);
        return authRepo.createSession(user);
    },
    async login(input: LoginInput): Promise<AuthSession> {
        const user = await authRepo.findUserByEmail(
            input.email.trim().toLowerCase()
        );
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const ok = await verifyPassword(user.passwordHash, input.password);
        if (!ok) {
            throw new Error("Invalid credentials");
        }
        return authRepo.createSession(user);
    },
    async logout(token: string): Promise<void> {
        await authRepo.deleteSession(token);
    },
    async current(token: string): Promise<AuthSession | null> {
        return authRepo.findSession(token);
    }
};
