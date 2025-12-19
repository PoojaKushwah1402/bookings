import { dataStore } from "./dataStore";
import type { Booking } from "../types/domain";

export type BookingInput = Omit<Booking, "id" | "status">;
export type BookingPatch = Partial<Omit<Booking, "id">>;

export const bookingService = {
    async list(): Promise<Booking[]> {
        return dataStore.listBookings();
    },
    async get(id: string): Promise<Booking | null> {
        return dataStore.findBooking(id);
    },
    async create(input: BookingInput): Promise<Booking> {
        const listing = dataStore.findListing(input.listingId);
        if (!listing) {
            throw new Error("Listing not found");
        }
        return dataStore.saveBooking(input);
    },
    async cancel(id: string): Promise<Booking | null> {
        const updated = dataStore.updateBooking(id, { status: "cancelled" });
        return updated;
    },
    async remove(id: string): Promise<boolean> {
        const exists = dataStore.findBooking(id);
        if (!exists) return false;
        dataStore.updateBooking(id, { status: "cancelled" });
        return true;
    },
};

