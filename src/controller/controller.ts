import { Request, Response } from "express"
import { searchResult } from "../../types"


export function getStatus(_req: Request, res: Response) {
    res.sendStatus(200)
}

export function getRepositoriesByName(req: Request, res: Response) {
    const { name } = req.query
    const searchResults = res.locals.items
    if (typeof name === "string") {
        const filteredItems = searchResults.filter((item: searchResult) => item.name.includes(name))
        res.json({ repositories: filteredItems })
    }
}
export function getRepositoriesById(req: Request, res: Response) {
    const searchResults = res.locals
    if (searchResults.status === "404") {
        res.json({})
    }
    else {
        res.json(searchResults)
    }
}

export function getReadme (req: Request, res: Response)  {
    const readme = res.locals.readme;
    if (readme) {
        res.json({ hasReadme: true, readme });
    } else {
        res.json({ hasReadme: false });
    }
};
