import express from "express"
import {  getRepositoriesById, getRepositoriesByName, getStatus,getReadme } from "./controller/controller"
import { fetchReadmeByOwnerByRepo, fetchGitHub } from "./middleware/github"

const app = express()

app.get("/status", getStatus)
app.get("/repositories", fetchGitHub,getRepositoriesByName)
app.get("/repositorydetails",fetchGitHub,getRepositoriesById)
app.get("/repositoryreadme",fetchGitHub,fetchReadmeByOwnerByRepo,getReadme)

export default app