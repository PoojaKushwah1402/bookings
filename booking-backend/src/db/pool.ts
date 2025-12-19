import {Pool} from "pg";

const {DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT} = process.env;

console.log({DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT});

export const pool = new Pool({
    // connectionString: `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});
