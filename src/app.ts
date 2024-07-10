import express from "express"

const app = express()

app.get("/status", (_req, res) => res.sendStatus(200))

export default app