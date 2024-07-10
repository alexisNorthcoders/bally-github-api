import express from "express"
import {  getRepositoriesById, getRepositoriesByName, getStatus,getReadme } from "./controller/controller"
import { fetchReadmeByOwnerByRepo, fetchRepositoriesByName, fetchRepositoryById } from "./middleware/github"

const app = express()

app.get("/status", getStatus)
app.get("/repositories", fetchRepositoriesByName,getRepositoriesByName)
app.get("/repositorydetails",fetchRepositoryById,getRepositoriesById)
app.get("/repositoryreadme",fetchRepositoryById,fetchReadmeByOwnerByRepo,getReadme)

export default app