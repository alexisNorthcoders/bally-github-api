import { NextFunction, Request, Response } from "express"

export async function fetchRepositoriesByName(req: Request, res: Response, next: NextFunction) {
    const { name } = req.query
    if (typeof name === "string") {
        const response = await fetch(`https://api.github.com/search/repositories?q=${name}`)
        res.locals = await response.json()
        next()
    }
    else {
        res.status(400).json({ message: "Bad request!" })
    }

}
export async function fetchRepositoryById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.query
    if (typeof id === "string") {
        const response = await fetch(`https://api.github.com/repositories/${id}`)
        res.locals = await response.json()
        next()
    }
    else {
        res.status(400).json({ message: "Bad request!" })
    }

}
export const fetchReadmeByOwnerByRepo = async (req: Request, res: Response, next: NextFunction) => {
    const owner = res.locals.owner.login
    const repo = res.locals.name
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`);
    const readme = await response.json()
    res.locals.readme = readme.data;
    next();
};

