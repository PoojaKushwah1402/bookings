import type {Listing} from "../types/domain";
import {listingRepo} from "../repositories/listingRepo";

export type ListingInput = Omit<Listing, "id">;
export type ListingPatch = Partial<Omit<Listing, "id">>;

export const listingService = {
    async list(): Promise<Listing[]> {
        return listingRepo.list();
    },
    async get(id: string): Promise<Listing | null> {
        return listingRepo.get(id);
    },
    async create(input: ListingInput): Promise<Listing> {
        return listingRepo.create(input);
    },
    async update(id: string, patch: ListingPatch): Promise<Listing | null> {
        return listingRepo.update(id, patch);
    },
    async remove(id: string): Promise<boolean> {
        return listingRepo.delete(id);
    }
};


