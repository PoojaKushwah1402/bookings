import { Response } from "express";

export type ApiError = {
    message: string;
    details?: unknown;
};

export const ok = <T>(res: Response, payload: T, status = 200) => res.status(status).json(payload);
export const created = <T>(res: Response, payload: T) => ok(res, payload, 201);
export const noContent = (res: Response) => res.status(204).end();
export const badRequest = (res: Response, message: string, details?: unknown) =>
    res.status(400).json({ message, details });
export const notFound = (res: Response, message = "Not found") => res.status(404).json({ message });
export const serverError = (res: Response, message = "Something went wrong") =>
    res.status(500).json({ message });



