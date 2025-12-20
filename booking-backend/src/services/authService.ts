import jwt from "jsonwebtoken";
import type {AuthSession, User} from "../types/domain";
import {authRepo} from "../repositories/authRepo";
import {hashPassword, hashToken, verifyPassword} from "../shared/password";

export type RegisterInput = {
    name: string;
    email: string;
    password: string;
};

export type LoginInput = {
    email: string;
    password: string;
};

const ACCESS_TTL = process.env.ACCESS_TOKEN_TTL ?? "10m";
const REFRESH_TTL = process.env.REFRESH_TOKEN_TTL ?? "1h";
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "dev-access-secret";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "dev-refresh-secret";

const signAccessToken = (user: User) =>
    jwt.sign({sub: user.id, email: user.email, role: user.role}, ACCESS_SECRET, {expiresIn: ACCESS_TTL});

const signRefreshToken = (user: User) =>
    jwt.sign({sub: user.id, email: user.email, role: user.role}, REFRESH_SECRET, {expiresIn: REFRESH_TTL});

const ttlToMs = (ttl: string): number => {
    if (ttl.endsWith("m")) return parseInt(ttl) * 60_000;
    if (ttl.endsWith("h")) return parseInt(ttl) * 3_600_000;
    return 10 * 60_000;
};

const calcExpiry = (ttl: string): Date => new Date(Date.now() + ttlToMs(ttl));

const issueTokens = async (user: User) => {
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    const refreshHash = await hashToken(refreshToken);
    await authRepo.createRefreshToken(user, refreshHash, calcExpiry(REFRESH_TTL));
    return {accessToken, refreshToken, user};
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
        const {accessToken, refreshToken} = await issueTokens(user);
        return {token: accessToken, user, refreshToken};
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
        const {accessToken, refreshToken} = await issueTokens(user);
        return {token: accessToken, user, refreshToken};
    },
    async refresh(refreshToken: string): Promise<AuthSession> {
        let payload: any;
        try {
            payload = jwt.verify(refreshToken, REFRESH_SECRET);
        } catch {
            throw new Error("Invalid refresh token");
        }
        const refreshHash = await hashToken(refreshToken);
        const stored = await authRepo.findRefreshToken(refreshHash);
        if (!stored || stored.user.id !== payload.sub) {
            throw new Error("Invalid refresh token");
        }
        const user = stored.user;
        const newAccess = signAccessToken(user);
        const newRefresh = signRefreshToken(user);
        const newHash = await hashToken(newRefresh);
        await authRepo.rotateRefreshToken(stored.tokenHash, newHash, calcExpiry(REFRESH_TTL), user);
        return {token: newAccess, user, refreshToken: newRefresh};
    },
    async logout(refreshToken: string): Promise<void> {
        try {
            const hash = await hashToken(refreshToken);
            await authRepo.deleteRefreshToken(hash);
        } catch {
            // ignore
        }
    },
    async current(token: string): Promise<AuthSession | null> {
        try {
            const decoded = jwt.verify(token, ACCESS_SECRET) as any;
            const user = await authRepo.findUserByEmail(decoded.email);
            if (!user) return null;
            return {token, user};
        } catch {
            return null;
        }
    }
};
