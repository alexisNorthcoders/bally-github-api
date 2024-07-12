export class Cache {
    private cache: { [key: string]: any };

    constructor() {
        this.cache = {};
    }

    get(key: string): any {
        return this.cache[key];
    }

    set(key: string, value: any): void {
        this.cache[key] = value;
    }

    has(key: string): boolean {
        return this.cache.hasOwnProperty(key);
    }
}