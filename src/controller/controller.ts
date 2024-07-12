import { Request, Response } from "express"
import { GitHubRepository } from "../../types"
import { Buffer } from 'buffer';
import { filterRepositoriesByName } from "../utils/utils";

export function getStatus(_req: Request, res: Response) {

    res.sendStatus(200)
}
export function getUser(_req: Request, res: Response) {
    const { login } = res.locals
    if (login) {
        res.status(200).json({ username: login })
    }
    else {
        res.status(404).json({ message: "Access token not found!" })
    }
}

export function getRepositoriesByName(req: Request, res: Response) {
    const { name } = req.query
    const searchResults = res.locals.items
    if (typeof name === "string") {
        const filteredItems = filterRepositoriesByName(searchResults, name)

        res.json({ repositories: filteredItems })
    }
}
export function getRepositoriesById(_req: Request, res: Response) {
    const searchResults = res.locals
    if (searchResults.status === "404") {
        res.status(404).json({ message: "Repository not found!" })
    }
    else {
        res.json(searchResults)
    }
}
export function getReadme(_req: Request, res: Response) {
    const readme = res.locals.readme;
    if (readme) {
        const content = Buffer.from(readme.content, readme.encoding).toString('utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="README.md"');
        res.setHeader('Content-Type', 'text/markdown');
        res.send(content);

    } else {
        res.json({});
    }
};
