import { NextFunction, Request, Response } from "express"

const gitHubCache: { [key: string]: any } = {}

export async function fetchGitHub(req: Request, res: Response, next: NextFunction) {
    const { name, id } = req.query
    if (name && typeof name === "string") {
        if (gitHubCache[`repositories:${name}`]) {
            res.locals = gitHubCache[`repositories:${name}`];
            return next();
        }
        try {
            const response = await fetch(`https://api.github.com/search/repositories?q=${name}`)
            res.locals = await response.json()
            gitHubCache[`repositories:${name}`] = res.locals;
            next()
        }
        catch (error) {
            res.status(500).json({ message: "Error fetching repositories by name from gitHub!" });
        }

    }
    else if (id && typeof id === "string") {
        if (gitHubCache[`repository:${id}`]) {
            res.locals = gitHubCache[`repository:${id}`];
            return next();
        }
        try {
            const response = await fetch(`https://api.github.com/repositories/${id}`)
            res.locals = await response.json()
            gitHubCache[`repository:${id}`] = res.locals
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
    if (owner && repo) {
        if (gitHubCache[`readme:${owner}/${repo}`]) {
            res.locals.readme = gitHubCache[`readme:${owner}/${repo}`];
            return next();
        }
        try {
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`);
            const readme = await response.json()
            res.locals.readme = readme;
            gitHubCache[`readme:${owner}/${repo}`] = readme;
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

