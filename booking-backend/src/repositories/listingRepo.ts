import {randomUUID} from "crypto";
import {pool} from "../db/pool";
import type {Listing} from "../types/domain";

const mapRow = (row: any): Listing => ({
    id: row.id,
    title: row.title,
    city: row.city,
    state: row.state,
    keywords: row.keywords ?? [],
    amenities: row.amenities ?? [],
    note: row.note ?? undefined
});

export const listingRepo = {
    async list(): Promise<Listing[]> {
        const result = await pool.query(
            `select id,
                    title,
                    city,
                    state,
                    keywords,
                    amenities,
                    note
             from listings
             order by created_at desc nulls last`
        );
        return result.rows.map(mapRow);
    },

    async get(id: string): Promise<Listing | null> {
        const result = await pool.query(
            `select id,
                    title,
                    city,
                    state,
                    keywords,
                    amenities,
                    note
             from listings
             where id = $1`,
            [id]
        );
        return result.rows[0] ? mapRow(result.rows[0]) : null;
    },

    async create(input: Omit<Listing, "id">): Promise<Listing> {
        const id = randomUUID();
        const result = await pool.query(
            `insert into listings
                (id, title, city, state, keywords, amenities, note)
             values ($1, $2, $3, $4, $5, $6, $7)
             returning id,
                       title,
                       city,
                       state,
                       keywords,
                       amenities,
                       note`,
            [
                id,
                input.title,
                input.city,
                input.state,
                input.keywords,
                input.amenities,
                input.note ?? null
            ]
        );
        return mapRow(result.rows[0]);
    },

    async update(id: string, patch: Partial<Omit<Listing, "id">>): Promise<Listing | null> {
        const assignments: string[] = [];
        const values: any[] = [];
        let idx = 1;

        if (patch.title !== undefined) {
            assignments.push(`title = $${idx++}`);
            values.push(patch.title);
        }
        if (patch.city !== undefined) {
            assignments.push(`city = $${idx++}`);
            values.push(patch.city);
        }
        if (patch.state !== undefined) {
            assignments.push(`state = $${idx++}`);
            values.push(patch.state);
        }
        if (patch.keywords !== undefined) {
            assignments.push(`keywords = $${idx++}`);
            values.push(patch.keywords);
        }
        if (patch.amenities !== undefined) {
            assignments.push(`amenities = $${idx++}`);
            values.push(patch.amenities);
        }
        if (patch.note !== undefined) {
            assignments.push(`note = $${idx++}`);
            values.push(patch.note);
        }

        if (!assignments.length) {
            return this.get(id);
        }

        values.push(id);

        const result = await pool.query(
            `update listings
             set ${assignments.join(", ")}
             where id = $${idx}
             returning id,
                       title,
                       city,
                       state,
                       keywords,
                       amenities,
                       note`,
            values
        );
        return result.rows[0] ? mapRow(result.rows[0]) : null;
    },

    async delete(id: string): Promise<boolean> {
        // Ensure bookings tied to the listing are also removed; rely on FK cascade if present.
        await pool.query(`delete from bookings where listing_id = $1`, [id]);
        const result = await pool.query(`delete from listings where id = $1`, [id]);
        return (result.rowCount ?? 0) > 0;
    }
};

