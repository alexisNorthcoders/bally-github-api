import { searchResult } from "../../types"

export async function fetchAllRepositories(name: string) {
    const response = await fetch(`https://api.github.com/search/repositories?q=${name}`)

    const { items } = await response.json()
    const filteredItems = items.filter((item:searchResult) => item.name.includes(name))
    return filteredItems
}