import {randomUUID} from "crypto";
import {pool} from "../db/pool";
import type {AuthSession, User} from "../types/domain";
import {verifyPassword} from "../shared/password";

const mapUser = (row: any): User => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role
});

type StoredRefresh = {
    tokenHash: string;
    user: User;
    expiresAt: Date;
};

const refreshStore: StoredRefresh[] = [];

export const authRepo = {
    async findUserByEmail(email: string): Promise<(User & {passwordHash: string}) | null> {
        const result = await pool.query(
            `select id, name, email, role, password_hash
             from users
             where email = $1`,
            [email]
        );
        const row = result.rows[0];
        if (!row) return null;
        return {...mapUser(row), passwordHash: row.password_hash};
    },

    async createUser(input: {name: string; email: string; passwordHash: string; role: string}): Promise<User> {
        const id = randomUUID();
        const result = await pool.query(
            `insert into users (id, name, email, role, password_hash)
             values ($1, $2, $3, $4, $5)
             returning id, name, email, role`,
            [id, input.name, input.email, input.role, input.passwordHash]
        );
        return mapUser(result.rows[0]);
    },

    async createRefreshToken(user: User, tokenHash: string, expiresAt: Date): Promise<AuthSession> {
        refreshStore.push({tokenHash, user, expiresAt});
        return {token: tokenHash, user};
    },

    async rotateRefreshToken(oldToken: string, newHash: string, expiresAt: Date, user: User): Promise<void> {
        const idx = refreshStore.findIndex((s) => s.tokenHash === oldToken);
        if (idx >= 0) {
            refreshStore.splice(idx, 1);
        }
        refreshStore.push({tokenHash: newHash, user, expiresAt});
    },

    async deleteRefreshToken(token: string): Promise<void> {
        const idx = refreshStore.findIndex((s) => s.tokenHash === token);
        if (idx >= 0) refreshStore.splice(idx, 1);
    },

    async deleteUserRefreshTokens(userId: string): Promise<void> {
        for (let i = refreshStore.length - 1; i >= 0; i--) {
            if (refreshStore[i].user.id === userId) refreshStore.splice(i, 1);
        }
    },

    async findRefreshToken(token: string): Promise<StoredRefresh | null> {
        const found = refreshStore.find((s) => s.tokenHash === token);
        if (!found) return null;
        if (found.expiresAt.getTime() < Date.now()) {
            await this.deleteRefreshToken(token);
            return null;
        }
        return found;
    }
};

