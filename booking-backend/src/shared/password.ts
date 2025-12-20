import argon2 from "argon2";

const {
    ARGON2_MEMORY_COST = "65536", // 64 MB
    ARGON2_TIME_COST = "3",
    ARGON2_PARALLELISM = "1",
    ARGON2_HASH_LENGTH = "32"
} = process.env;

const argonOptions: argon2.Options & {raw?: false} = {
    type: argon2.argon2id,
    memoryCost: Number(ARGON2_MEMORY_COST),
    timeCost: Number(ARGON2_TIME_COST),
    parallelism: Number(ARGON2_PARALLELISM),
    hashLength: Number(ARGON2_HASH_LENGTH)
};

export const hashPassword = async (password: string): Promise<string> => {
    return argon2.hash(password, argonOptions);
};

export const verifyPassword = async (hash: string, password: string): Promise<boolean> => {
    try {
        return await argon2.verify(hash, password, argonOptions);
    } catch {
        return false;
    }
};

// Convenience for refresh token hashing (reuse argon2id settings)
export const hashToken = (token: string) => hashPassword(token);
export const verifyToken = (hash: string, token: string) => verifyPassword(hash, token);

