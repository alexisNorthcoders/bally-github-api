import { NextFunction, Request, Response } from "express"
import { Cache } from "../cache/Cache";

const gitHubCache = new Cache()

export async function fetchGitHub(req: Request, res: Response, next: NextFunction) {
    const { name, id } = req.query
    if (name && typeof name === "string") {
        const key = `repositories:${name}`
        if (gitHubCache.has(key)) {
            res.locals = gitHubCache.get(key);
            return next();
        }
        try {
            const response = await fetch(`https://api.github.com/search/repositories?q=${name}`)
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
            const response = await fetch(`https://api.github.com/repositories/${id}`)
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

export const fetchReadmeByOwnerByRepo = async (req: Request, res: Response, next: NextFunction) => {
    const owner = res.locals.owner?.login
    const repo = res.locals.name
    const key = `readme:${owner}/${repo}`
    if (owner && repo) {
        if (gitHubCache.has(key)) {
            res.locals.readme = gitHubCache.get(key)
            return next();
        }
        try {
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`);
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

