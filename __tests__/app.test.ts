import request from "supertest";
import app from "../src/app";

describe("GET /status/", () => {
    test("200: status code, indicating server is running", async () => {
        const { status } = await request(app).get("/status");
        expect(status).toEqual(200);
    });
});