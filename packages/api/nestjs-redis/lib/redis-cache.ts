export abstract class RedisCache {
  abstract readonly prefix: string

  protected buildCacheKey (id: string): string {
    return `${this.prefix}.${id}`
  }
}
