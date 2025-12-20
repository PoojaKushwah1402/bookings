import {RequestHandler} from "express";
import {authService} from "../services/authService";
import {badRequest, ok} from "../shared/http";
import {isEmail, requiredString} from "../shared/validation";

const setRefreshCookie = (res: any, token: string) => {
    const secure = process.env.NODE_ENV === "production";
    res.cookie("refresh_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure,
        maxAge: 1000 * 60 * 60 // 1 hour
    });
};

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
        if (session.refreshToken) setRefreshCookie(res, session.refreshToken);
        return ok(res, {accessToken: session.token, user: session.user}, 201);
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
        if (session.refreshToken) setRefreshCookie(res, session.refreshToken);
        return ok(res, {accessToken: session.token, user: session.user});
    } catch (err) {
        return badRequest(res, (err as Error).message);
    }
};

export const logout: RequestHandler = async (req, res) => {
    const refresh = req.cookies?.refresh_token;
    if (!refresh) return ok(res, {message: "Signed out"});
    await authService.logout(refresh);
    res.clearCookie("refresh_token");
    return ok(res, {message: "Signed out"});
};

export const refresh: RequestHandler = async (req, res) => {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) return badRequest(res, "Missing refresh token");
    try {
        const session = await authService.refresh(refreshToken);
        if (session.refreshToken) setRefreshCookie(res, session.refreshToken);
        return ok(res, {accessToken: session.token, user: session.user});
    } catch (err) {
        res.clearCookie("refresh_token");
        return badRequest(res, (err as Error).message);
    }
};
