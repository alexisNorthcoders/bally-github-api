import request from "supertest";
import app from "../src/app";

describe("GET /status/", () => {
    test("200: status code, indicating that server is running", async () => {
        const { status } = await request(app).get("/status");
        expect(status).toEqual(200);
    });
});
describe("GET /repositories", () => {
    test("200: status code. Server send an object with all repositories", async () => {
        const { body: { repositories } } = await request(app).get("/repositories");
        expect(repositories).toBeDefined()
    });
});