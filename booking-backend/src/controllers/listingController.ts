import {RequestHandler} from "express";
import {listingService} from "../services/listingService";
import {
    badRequest,
    created,
    noContent,
    notFound,
    ok,
    serverError
} from "../shared/http";
import {
    arrayOfStrings,
    optionalString,
    requiredString,
    requireAll
} from "../shared/validation";

const validateListingBody = (body: unknown) => {
    const payload = body as Record<string, unknown>;
    return requireAll(
        requiredString("userId", payload.userId),
        requiredString("title", payload.title),
        requiredString("city", payload.city),
        requiredString("state", payload.state),
        arrayOfStrings("keywords", payload.keywords),
        arrayOfStrings("amenities", payload.amenities),
        optionalString("note", payload.note)
    );
};

export const listListings: RequestHandler = async (_req, res) => {
    try {
        const listings = await listingService.list();
        return ok(res, listings);
    } catch (err) {
        return serverError(res);
    }
};

export const getListing: RequestHandler = async (req, res) => {
    try {
        const listing = await listingService.get(req.params.id);
        if (!listing) return notFound(res, "Listing not found");
        return ok(res, listing);
    } catch (err) {
        return serverError(res);
    }
};

export const createListing: RequestHandler = async (req, res) => {
    const errors = validateListingBody(req.body);
    if (errors.length)
        return badRequest(res, "Invalid listing payload", errors);
    try {
        const listing = await listingService.create(req.body);
        return created(res, listing);
    } catch (err) {
        console.log("error occured during listing creation", err);
        return serverError(res);
    }
};

export const updateListing: RequestHandler = async (req, res) => {
    const errors = validateListingBody(req.body);
    if (errors.length)
        return badRequest(res, "Invalid listing payload", errors);
    try {
        const listing = await listingService.update(req.params.id, req.body);
        if (!listing) return notFound(res, "Listing not found");
        return ok(res, listing);
    } catch (err) {
        return serverError(res);
    }
};

export const deleteListing: RequestHandler = async (req, res) => {
    try {
        const deleted = await listingService.remove(req.params.id);
        if (!deleted) return notFound(res, "Listing not found");
        return noContent(res);
    } catch (err) {
        return serverError(res);
    }
};
