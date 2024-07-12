export interface GitHubRepository {
    name: string,
    id: number,
    forks_count: number,
    open_issues: number,
    owner?: {
        login: string
    }
}
export interface GitHubSearchResponse {
    items: GitHubRepository[];

}