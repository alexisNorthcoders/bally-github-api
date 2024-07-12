import { GitHubRepository } from "../../types";
export function filterRepositoriesByName(repositories: GitHubRepository[], name: string) {
    return repositories.filter((item: GitHubRepository) => item.name.includes(name)).map(repo => extractRelevantInfo(repo));
}
export function extractRelevantInfo(repository: GitHubRepository) {
    return {
        id: repository.id,
        name: repository.name,
        description: repository.description,
        html_url: repository.html_url,
        open_issues: repository.open_issues,
        forks_count: repository.forks_count
    }
}