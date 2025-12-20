import {RequestHandler} from "express";
import {authService} from "../services/authService";
import {badRequest, ok} from "../shared/http";
import {isEmail, requiredString} from "../shared/validation";

export const register: RequestHandler = async (req, res) => {
    const {name, email, password} = req.body ?? {};
    const errors = [
        requiredString("name", name),
        isEmail("email", email),
        requiredString("password", password)
    ]
        .filter((e) => !e.valid)
        .map((e) => e.message);

    if (errors.length)
        return badRequest(res, "Invalid registration payload", errors);

    try {
        const session = await authService.register({name, email, password});
        return ok(res, session, 201);
    } catch (err) {
        return badRequest(res, (err as Error).message);
    }
};

export const login: RequestHandler = async (req, res) => {
    const {email, password} = req.body ?? {};
    const errors = [
        isEmail("email", email),
        requiredString("password", password)
    ]
        .filter((e) => !e.valid)
        .map((e) => e.message);
    if (errors.length) return badRequest(res, "Invalid login payload", errors);

    try {
        const session = await authService.login({email, password});
        return ok(res, session);
    } catch (err) {
        return badRequest(res, (err as Error).message);
    }
};

export const logout: RequestHandler = async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return badRequest(res, "Missing token");
    await authService.logout(token);
    return ok(res, {message: "Signed out"});
};
