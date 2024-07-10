import express from "express"
import { getRepositories, getStatus } from "./controller/controller"

const app = express()

app.get("/status", getStatus)
app.get("/repositories", getRepositories)

export default app