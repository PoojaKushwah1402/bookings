import type {Booking} from "../types/domain";
import {bookingRepo} from "../repositories/bookingRepo";
import {listingRepo} from "../repositories/listingRepo";

export type BookingInput = Omit<Booking, "id" | "status">;
export type BookingPatch = Partial<Omit<Booking, "id">>;

export const bookingService = {
    async list(): Promise<Booking[]> {
        return bookingRepo.list();
    },
    async get(id: string): Promise<Booking | null> {
        return bookingRepo.get(id);
    },
    async create(input: BookingInput): Promise<Booking> {
        const listing = await listingRepo.get(input.listingId);
        if (!listing) {
            throw new Error("Listing not found");
        }
        return bookingRepo.create(input);
    },
    async cancel(id: string): Promise<Booking | null> {
        return bookingRepo.update(id, {status: "cancelled"});
    },
    async confirm(id: string): Promise<Booking | null> {
        return bookingRepo.update(id, {status: "confirmed"});
    },
    async remove(id: string): Promise<boolean> {
        const existing = await bookingRepo.get(id);
        if (!existing) return false;
        await bookingRepo.delete(id);
        return true;
    }
};


