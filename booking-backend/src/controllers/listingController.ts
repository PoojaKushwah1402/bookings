import { RequestHandler } from "express";
import { listingService } from "../services/listingService";
import { badRequest, created, noContent, notFound, ok } from "../shared/http";
import { arrayOfStrings, optionalString, requiredString, requireAll } from "../shared/validation";

const validateListingBody = (body: unknown) => {
    const payload = body as Record<string, unknown>;
    const availability = (payload?.availability ?? {}) as Record<string, unknown>;
    return requireAll(
        requiredString("title", payload.title),
        requiredString("city", payload.city),
        requiredString("state", payload.state),
        arrayOfStrings("keywords", payload.keywords),
        arrayOfStrings("amenities", payload.amenities),
        requiredString("availability.startDate", availability.startDate),
        requiredString("availability.endDate", availability.endDate),
        optionalString("availability.note", availability.note)
    );
};

export const listListings: RequestHandler = async (_req, res) => {
    const listings = await listingService.list();
    return ok(res, listings);
};

export const getListing: RequestHandler = async (req, res) => {
    const listing = await listingService.get(req.params.id);
    if (!listing) return notFound(res, "Listing not found");
    return ok(res, listing);
};

export const createListing: RequestHandler = async (req, res) => {
    const errors = validateListingBody(req.body);
    if (errors.length) return badRequest(res, "Invalid listing payload", errors);
    const listing = await listingService.create(req.body);
    return created(res, listing);
};

export const updateListing: RequestHandler = async (req, res) => {
    const errors = validateListingBody(req.body);
    if (errors.length) return badRequest(res, "Invalid listing payload", errors);
    const listing = await listingService.update(req.params.id, req.body);
    if (!listing) return notFound(res, "Listing not found");
    return ok(res, listing);
};

export const deleteListing: RequestHandler = async (req, res) => {
    const deleted = await listingService.remove(req.params.id);
    if (!deleted) return notFound(res, "Listing not found");
    return noContent(res);
};

