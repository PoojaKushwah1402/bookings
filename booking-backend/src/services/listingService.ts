import { dataStore } from "./dataStore";
import type { Listing } from "../types/domain";

export type ListingInput = Omit<Listing, "id">;
export type ListingPatch = Partial<Omit<Listing, "id">>;

export const listingService = {
    async list(): Promise<Listing[]> {
        return dataStore.listListings();
    },
    async get(id: string): Promise<Listing | null> {
        return dataStore.findListing(id);
    },
    async create(input: ListingInput): Promise<Listing> {
        return dataStore.saveListing(input);
    },
    async update(id: string, patch: ListingPatch): Promise<Listing | null> {
        return dataStore.updateListing(id, patch);
    },
    async remove(id: string): Promise<boolean> {
        return dataStore.deleteListing(id);
    },
};

