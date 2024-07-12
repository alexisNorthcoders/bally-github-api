import request from "supertest";
import app from "../src/app";
import { GitHubRepository } from "../types";
import fetchMock from "jest-fetch-mock";
import { gitHubCache } from "../src/middleware/github";
beforeAll(() => {
    fetchMock.enableMocks();

});
afterEach(() => {
    gitHubCache.clear()
})
beforeEach(() => {
    fetchMock.resetMocks();
});

afterAll(() => {
    fetchMock.disableMocks();
});

describe("GET /status/", () => {

    test("200: status code. Indicates that server is running", async () => {

        fetchMock.mockResponseOnce(JSON.stringify(""));

        const { status } = await request(app).get("/status");
        expect(status).toEqual(200);
    });
    test("200: status code. Responds with isAuthenticated and username properties", async () => {
        const mockResponse = { body: { isAuthenticated: false, username: "" } }
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

        const { status, body: { isAuthenticated, username } } = await request(app).get("/status");
        expect(status).toEqual(200)
        expect(isAuthenticated).toEqual(false)
        expect(username).toEqual("")
    });

});
describe("GET /repositories?name={searchQuery}", () => {

    test("200: status code. Server sends an object with repositories property and includes array with search results", async () => {
        const searchQuery = "random"
        const mockRepositories: GitHubRepository[] = [
            { id: 1, name: "random-1", forks_count: 3, open_issues: 45 },
            { id: 2, name: "random-2", forks_count: 2, open_issues: 23 },
        ];
        fetchMock.mockResponseOnce(JSON.stringify({ items: mockRepositories }));

        const { status, body: { repositories } } = await request(app).get(`/repositories?name=${searchQuery}`);

        expect(status).toEqual(200)
        expect(repositories).toBeDefined()
        expect(repositories.length).toBe(2)
        repositories.forEach((repository: GitHubRepository) => {
            expect(Object.keys(repository).length).toBe(4)
        })
    });
    test("200: status code. Server should only return repositories with same name as the query", async () => {
        const searchQuery = "sameAsQuery"
        const mockRepositories: GitHubRepository[] = [
            { id: 1, name: "sameAsQuery", forks_count: 3, open_issues: 45 },
            { id: 2, name: "sameAsQuery", forks_count: 2, open_issues: 23 },
            { id: 3, name: "notAsQuery", forks_count: 2, open_issues: 23 },
        ];
        fetchMock.mockResponseOnce(JSON.stringify({ items: mockRepositories }));
        const { status, body: { repositories } } = await request(app).get(`/repositories?name=${searchQuery}`);

        expect(status).toEqual(200)
        expect(repositories.length).toEqual(2)
        repositories.forEach((repository: GitHubRepository) => {
            const nameIncludesQuery = repository.name.includes(searchQuery)
            expect(nameIncludesQuery).toEqual(true)
        })
    });
    test("200: status code. Server should return empty search results if no repository found", async () => {
        const searchQuery = "xxdsda22333"
        const mockResponse = {
            "total_count": 0,
            "incomplete_results": false,
            "items": []
        }
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));
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
        const mockRepository: GitHubRepository =
        {
            id: 1, name: "random-1", forks_count: 3, open_issues: 45,
            owner: {
                login: "johny"
            }
        }

        fetchMock.mockResponseOnce(JSON.stringify(mockRepository));
        const { body } = await request(app).get(`/repositorydetails?id=${repositoryId}`);
        expect(body).toEqual(mockRepository)

    });
    test("404: status code. Server sends not found error if repository doesn't exist", async () => {
        const repositoryId = "2"
        const mockResponse = {
            "message": "Not Found",
            "documentation_url": "https://docs.github.com/rest/repos/repos#get-a-repository",
            "status": "404"
        }

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));
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
        const mockRepository: GitHubRepository =
        {
            id: 1, name: "random-1", forks_count: 3, open_issues: 45,
            owner: {
                login: "johny"
            }
        }
        const mockReadme = {
            content: "VGhpcyBpcyBhIHRlc3QgcmVhZG1lLg==",
        };

        fetchMock.mockResponses(
            JSON.stringify(mockRepository),
            JSON.stringify(mockReadme)
        );

        const { headers, status, body } = await request(app).get(`/repositoryreadme?id=${repositoryId}`)

        expect(status).toBe(200);
        expect(headers['content-disposition']).toBe('attachment; filename="README.md"');

    });
    test("404: status code. Server send not found error if repository not found", async () => {

        const repositoryId = "2"
        const mockResponse = {
            "message": "Not Found",
            "documentation_url": "https://docs.github.com/rest/repos/repos#get-a-repository",
            "status": "404"
        }

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));
        const { status } = await request(app).get(`/repositoryreadme?id=${repositoryId}`)

        expect(status).toBe(404);

    });

})