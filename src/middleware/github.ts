import { NextFunction, Request, Response } from "express"
import { Cache } from "../cache/Cache";

const gitHubCache = new Cache()

export async function fetchGitHub(req: Request, res: Response, next: NextFunction) {
    const { name, id } = req.query
    const token = res.locals.token;

    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

    if (name && typeof name === "string") {
        const key = `repositories:${name}`
        if (gitHubCache.has(key)) {
            res.locals = gitHubCache.get(key);
            return next();
        }
        try {
            const response = await fetch(`https://api.github.com/search/repositories?q=${name}`, { headers })
            res.locals = await response.json()
            gitHubCache.set(key, res.locals)
            next()
        }
        catch (error) {
            res.status(500).json({ message: "Error fetching repositories by name from gitHub!" });
        }

    }
    else if (id && typeof id === "string") {
        const key = `repository:${id}`
        if (gitHubCache.has(key)) {
            res.locals = gitHubCache.get(key)
            return next();
        }
        try {
            const response = await fetch(`https://api.github.com/repositories/${id}`, { headers })
            res.locals = await response.json()
            gitHubCache.set(key, res.locals)
            next()
        }
        catch (error) {
            res.status(500).json({ message: "Error fetching repository by id from gitHub!" });
        }
    }
    else {
        res.status(400).json({ message: "Bad request!" })
    }
}

export async function fetchReadmeByOwnerByRepo(req: Request, res: Response, next: NextFunction) {
    const owner = res.locals.owner?.login
    const repo = res.locals.name
    const key = `readme:${owner}/${repo}`
    const token = res.locals.token;

    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
    if (owner && repo) {
        if (gitHubCache.has(key)) {
            res.locals.readme = gitHubCache.get(key)
            return next();
        }
        try {
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
            const readme = await response.json()
            res.locals.readme = readme;
            gitHubCache.set(key, readme)
            next();
        }
        catch (error) {
            res.status(500).json({ message: "Error fetching readme from gitHub!" });
        }
    }
    else {
        res.status(404).json({ message: "Repository not found!" })
    }

};

export async function fetchCurrentUser(req: Request, res: Response) {
    const token = res.locals.token;

    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        try {
            const response = await fetch(`https://api.github.com/user`, { headers })
            const {login} = await response.json()
            
            res.status(200).json({username:login})
        }
        catch (error) {
            res.status(500).json({ message: "Error fetching from gitHub!" });
        }
    }

