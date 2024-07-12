import { GitHubRepository } from "../../types";
export function filterRepositoriesByName(repositories:GitHubRepository[],name:string){
    return repositories.filter((item: GitHubRepository) => item.name.includes(name))
}