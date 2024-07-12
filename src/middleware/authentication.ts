import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

export function useGithubAuthToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    } else {
        token = process.env.GITHUB_ACCESS_TOKEN;
    }

    if (token) {
        res.locals.token = token;
    }

    next();
}