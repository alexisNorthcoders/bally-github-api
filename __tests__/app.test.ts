import request from "supertest";
import app from "../src/app";
import { searchResult } from "../types";


describe("GET /status/", () => {
    test("200: status code. Indicates that server is running", async () => {
        const { status } = await request(app).get("/status");
        expect(status).toEqual(200);
    });
    test("200: status code. Responds with isAuthenticated and username properties",async () => {
        const { status,body:{isAuthenticated,username} } = await request(app).get("/status");
        expect(status).toEqual(200)
        expect(typeof isAuthenticated).toEqual("boolean")
        expect(username).toBeDefined()
    });

});
describe("GET /repositories?name={searchQuery}", () => {
    test("200: status code. Server sends an object with repositories property and includes array with search results", async () => {
        const searchQuery = "random"
        const { status, body: { repositories } } = await request(app).get(`/repositories?name=${searchQuery}`);
        expect(status).toEqual(200)
        expect(repositories).toBeDefined()
        expect(repositories.length).toBeGreaterThanOrEqual(1)
    });
    test("200: status code. Server should only return repositories with name that includes query", async () => {
        const searchQuery = "random"
        const { status, body: { repositories } } = await request(app).get(`/repositories?name=${searchQuery}`);

        expect(status).toEqual(200)
        repositories.forEach((repository: searchResult) => {
            const nameIncludesQuery = repository.name.includes(searchQuery)
            expect(nameIncludesQuery).toEqual(true)
        })
    });
    test("200: status code. Server should return empty search results if no repository found", async () => {
        const searchQuery = "xxdsda22333"
        const { status, body: { repositories } } = await request(app).get(`/repositories?name=${searchQuery}`);
        expect(status).toEqual(200)
        expect(repositories).toEqual([])
    });
    test("400: status code. Server responds with error if search parameter is missing", async () => {

        const { status } = await request(app).get(`/repositories`);
        expect(status).toEqual(400)
    });


});
describe("GET /repositorydetails?id={repositoryId}", () => {
    test("200: status code. Server sends details of repository by given id", async () => {
        const repositoryId = "1"
        const { body: { id } } = await request(app).get(`/repositorydetails?id=${repositoryId}`);
        expect(id).toEqual(1)

    });
    test("404: status code. Server sends not found error if repository doesn't exist", async () => {
        const repositoryId = "2"
        const { status } = await request(app).get(`/repositorydetails?id=${repositoryId}`);
        expect(status).toEqual(404)

    });
    test("400: status code. Server responds with error if search parameter is missing", async () => {
        const { status } = await request(app).get(`/repositorydetails`);
        expect(status).toEqual(400)
    });
})
describe("GET /repositoryreadme?id={repositoryId}", () => {
    test("200: status code. Server sends readme if available", async () => {
        const repositoryId = "1"
        const { headers, status } = await request(app).get(`/repositoryreadme?id=${repositoryId}`)

        expect(status).toBe(200);
        expect(headers['content-disposition']).toBe('attachment; filename="README.md"');

    });
    test("404: status code. Server send not found error if repository not found", async () => {
        const repositoryId = "2"
        const { status } = await request(app).get(`/repositoryreadme?id=${repositoryId}`)

        expect(status).toBe(404);

    });

})