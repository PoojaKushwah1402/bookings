import {RequestHandler} from "express";
import {bookingService} from "../services/bookingService";
import {
    badRequest,
    created,
    noContent,
    notFound,
    ok,
    serverError
} from "../shared/http";
import {optionalString, requiredString, requireAll} from "../shared/validation";

const validateBookingBody = (body: unknown) => {
    const payload = body as Record<string, unknown>;
    return requireAll(
        requiredString("userId", payload.userId),
        requiredString("listingId", payload.listingId),
        requiredString("startDate", payload.startDate),
        requiredString("endDate", payload.endDate),
        optionalString("note", payload.note)
    );
};

//_req  - unused on purpose
export const listBookings: RequestHandler = async (_req, res) => {
    try {
        const bookings = await bookingService.list();
        return ok(res, bookings);
    } catch (err) {
        console.log("1------", err);
        return serverError(res);
    }
};

export const getBooking: RequestHandler = async (req, res) => {
    try {
        const booking = await bookingService.get(req.params.id);
        if (!booking) return notFound(res, "Booking not found");
        return ok(res, booking);
    } catch (err) {
        console.log("2------", err);
        return serverError(res);
    }
};

export const createBooking: RequestHandler = async (req, res) => {
    const errors = validateBookingBody(req.body);
    if (errors.length)
        return badRequest(res, "Invalid booking payload", errors);
    try {
        const booking = await bookingService.create(req.body);
        return created(res, booking);
    } catch (err) {
        const message = (err as Error).message;
        if (message === "Listing not found") {
            return badRequest(res, message);
        }
        console.log("3------", err);
        return serverError(res);
    }
};

export const cancelBooking: RequestHandler = async (req, res) => {
    try {
        const booking = await bookingService.cancel(req.params.id);
        if (!booking) return notFound(res, "Booking not found");
        return ok(res, booking);
    } catch (err) {
        console.log("4------", err);
        return serverError(res);
    }
};

export const confirmBooking: RequestHandler = async (req, res) => {
    try {
        const booking = await bookingService.confirm(req.params.id);
        if (!booking) return notFound(res, "Booking not found");
        return ok(res, booking);
    } catch (err) {
        console.log("confirm-booking-error", err);
        return serverError(res);
    }
};

export const deleteBooking: RequestHandler = async (req, res) => {
    try {
        const removed = await bookingService.remove(req.params.id);
        if (!removed) return notFound(res, "Booking not found");
        return noContent(res);
    } catch (err) {
        console.log("5------", err);
        return serverError(res);
    }
};
