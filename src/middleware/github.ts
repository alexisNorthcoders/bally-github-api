import { NextFunction, Request, Response } from "express"

export async function fetchGitHub(req: Request, res: Response, next: NextFunction) {
    const { name, id } = req.query
    if (name && typeof name === "string") {
        const response = await fetch(`https://api.github.com/search/repositories?q=${name}`)
        res.locals = await response.json()
        next()
    }
    if (id && typeof id === "string") {
        const response = await fetch(`https://api.github.com/repositories/${id}`)
        res.locals = await response.json()
        console.log(res.locals)
        next()
    }
    else {
        res.status(400).json({ message: "Bad request!" })
    }
}

export const fetchReadmeByOwnerByRepo = async (req: Request, res: Response, next: NextFunction) => {
    const owner = res.locals.owner.login
    const repo = res.locals.name
    if (owner && repo) {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`);
        const readme = await response.json()
        res.locals.readme = readme;
        next();
    }
    else {
        res.status(200).json({})
    }

};

