import { Request, Response } from "express"
export function getStatus(_req: Request, res: Response) {
    res.sendStatus(200)
}
export function getRepositories(req: Request, res: Response) {
    res.json({ repositories: "repo" })

}