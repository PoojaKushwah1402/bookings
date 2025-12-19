import {randomUUID} from "crypto";
import {pool} from "../db/pool";
import type {AuthSession, User} from "../types/domain";

const mapUser = (row: any): User => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role
});

const sessionStore: AuthSession[] = [];

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

    async createSession(user: User): Promise<AuthSession> {
        const token = randomUUID();
        const session: AuthSession = {token, user};
        sessionStore.push(session);
        return session;
    },

    async deleteSession(token: string): Promise<void> {
        const idx = sessionStore.findIndex((s) => s.token === token);
        if (idx >= 0) sessionStore.splice(idx, 1);
    },

    async findSession(token: string): Promise<AuthSession | null> {
        return sessionStore.find((s) => s.token === token) ?? null;
    }
};

