import request from "supertest";
import app from "../src/app";
import { searchResult } from "../types";

describe("GET /status/", () => {
    test("200: status code. Indicates that server is running", async () => {
        const { status } = await request(app).get("/status");
        expect(status).toEqual(200);
    });
});
describe("GET /repositories?name={searchQuery}", () => {
    test("200: status code. Server sends an object with repositories property and includes array with search results", async () => {
        const searchQuery = "random"
        const { body: { repositories } } = await request(app).get(`/repositories?name=${searchQuery}`);
        expect(repositories).toBeDefined()
        expect(repositories.length).toBeGreaterThanOrEqual(1)
    });
    test("200: status code. Server should only return repositories with name that includes query", async () => {
        const searchQuery = "random"
        const { body: { repositories } } = await request(app).get(`/repositories?name=${searchQuery}`);
        repositories.forEach((repository: searchResult) => {
            const nameIncludesQuery = repository.name.includes(searchQuery)
            expect(nameIncludesQuery).toEqual(true)
        })
    });
    test("200: status code. Server should return empty search results if no repository found", async () => {
        const searchQuery = "xxdsda22333"
        const { body: { repositories } } = await request(app).get(`/repositories?name=${searchQuery}`);
        expect(repositories).toEqual([])
    });

});