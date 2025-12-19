import {randomUUID} from "crypto";
import {pool} from "../db/pool";
import type {Booking} from "../types/domain";

const mapRow = (row: any): Booking => ({
    id: row.id,
    listingId: row.listing_id,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
    note: row.note ?? undefined
});

export const bookingRepo = {
    async list(): Promise<Booking[]> {
        const result = await pool.query(
            `select id, listing_id, start_date, end_date, status, note
             from bookings
             order by created_at desc nulls last`
        );
        return result.rows.map(mapRow);
    },

    async get(id: string): Promise<Booking | null> {
        const result = await pool.query(
            `select id, listing_id, start_date, end_date, status, note
             from bookings
             where id = $1`,
            [id]
        );
        return result.rows[0] ? mapRow(result.rows[0]) : null;
    },

    async create(input: Omit<Booking, "id" | "status">): Promise<Booking> {
        const id = randomUUID();
        const result = await pool.query(
            `insert into bookings (id, listing_id, start_date, end_date, status, note)
             values ($1, $2, $3, $4, 'pending', $5)
             returning id, listing_id, start_date, end_date, status, note`,
            [id, input.listingId, input.startDate, input.endDate, input.note ?? null]
        );
        return mapRow(result.rows[0]);
    },

    async update(id: string, patch: Partial<Omit<Booking, "id">>): Promise<Booking | null> {
        const assignments: string[] = [];
        const values: any[] = [];
        let idx = 1;

        if (patch.startDate !== undefined) {
            assignments.push(`start_date = $${idx++}`);
            values.push(patch.startDate);
        }
        if (patch.endDate !== undefined) {
            assignments.push(`end_date = $${idx++}`);
            values.push(patch.endDate);
        }
        if (patch.status !== undefined) {
            assignments.push(`status = $${idx++}`);
            values.push(patch.status);
        }
        if (patch.note !== undefined) {
            assignments.push(`note = $${idx++}`);
            values.push(patch.note);
        }

        if (!assignments.length) return this.get(id);

        values.push(id);

        const result = await pool.query(
            `update bookings
             set ${assignments.join(", ")}
             where id = $${idx}
             returning id, listing_id, start_date, end_date, status, note`,
            values
        );
        return result.rows[0] ? mapRow(result.rows[0]) : null;
    },

    async delete(id: string): Promise<boolean> {
        const result = await pool.query(`delete from bookings where id = $1`, [id]);
        return (result.rowCount ?? 0) > 0;
    }
};

