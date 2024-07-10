import { Request, Response } from "express"
import { fetchAllRepositories } from "../model/model"


export function getStatus(_req: Request, res: Response) {
    res.sendStatus(200)
}
export async function getRepositories(req: Request, res: Response) {
    const { name } = req.query
    if (typeof name === "string") {
        const repositories = await fetchAllRepositories(name)
        res.json({ repositories })
    }
    else {
        res.status(400).json({ message: "Bad request!" })
    }

}