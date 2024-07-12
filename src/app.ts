import express from "express"
import {  getRepositoriesById, getRepositoriesByName, getStatus,getReadme } from "./controller/controller"
import { fetchReadmeByOwnerByRepo, fetchGitHub,fetchCurrentUser } from "./middleware/github"
import { useGithubAuthToken } from "./middleware/authentication"

const app = express()

app.get("/status",useGithubAuthToken, getStatus)
app.get("/repositories",useGithubAuthToken, fetchGitHub,getRepositoriesByName)
app.get("/repositorydetails",useGithubAuthToken,fetchGitHub,getRepositoriesById)
app.get("/repositoryreadme",useGithubAuthToken,fetchGitHub,fetchReadmeByOwnerByRepo,getReadme)
app.get("/currentuser",useGithubAuthToken,fetchCurrentUser)

export default app