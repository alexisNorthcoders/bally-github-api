# Node.js API
### Service that utilizes GitHub API allowing to query repositories by name

- [Installation](#installation)
- [Testing](#testing)
- [Cache](#cache)
- [API-Endpoints](#api-endpoints)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/alexisNorthcoers/bally-github-api.git
   cd bally-github-api
2. Install dependencies:
   ```sh
   npm install
3. Create a .env file in the root directory with the following environment variables:
   ```sh
   PORT=<your port here, default will be 3600>
   GITHUB_AUTH_TOKEN= <this is optional and not recommended>
   ```
    Note: Using the authentication token will significantly increase the response time as with every request the GitHub API is cheking your permissions. You can also add the Access Token in the Bearer manually when doing a request.

4. Start the server:
   ```sh
   npm start
   ```
    The server will start listening on the port specified in the .env file (default is 3600).

## Testing
To run Jest tests :
   ```sh
   npm test
   ```
These tests focus on endpoint testing, using unit testing techniques with mocked API calls to verify the functionality and error handling individual endpoints.

Manual testing :
```
curl http://localhost:3600/status
curl http://localhost:3600/repositories?name=bally-github-api
curl http://localhost:3600/repositordetails?id=bally=github-api
curl http://localhost:3600/repositoryreadme?id=bally=github-api
```

## Cache
This service implements a rudimentary in-memory caching system.
It provides a fast way to retrieve and store data without needing to fetch it repeatedly from GitHub.

## API Endpoints
A **postman_collection.json** is provided in the root directory of the project.

### GET /status

Description: Check if the server is running.

### GET /currentuser

Description: If using an Access Token in the Bearer or .env, the service will return the current authenticated GitHub user. 

### GET /repositories?name=\<repository name>

Description: Get repositories by name.

### GET /repositorydetails?id=\<repository id>

Description: Get repository details by ID.

### GET /repositoryreadme?id=\<repository id>

Description: Get the README of a repository by ID.
