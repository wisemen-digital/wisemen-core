import { PathResolver, Resolver } from './path-resolver.js'

export interface ResolvedImport {
  path: string
  name: string
}

export class ResolverRegistry<R extends Record<string, Resolver>> {
  private resolvers: R
  private pathResolver = new PathResolver()

  constructor (resolvers: R) {
    this.resolvers = resolvers
  }

  resolveImports<K extends keyof R>(keys: K[]): ResolvedImport[] {
    const imports: ResolvedImport[] = []

    for (const key of keys) {
      const resolver = this.resolvers[key]
      const filePath = this.pathResolver.resolveFilePath(resolver)

      if (filePath != null) {
        imports.push({
          path: filePath,
          name: resolver.name
        })
      }
    }

    return imports
  }

  resolveImport<K extends keyof R>(key: K): ResolvedImport | null {
    const resolver = this.resolvers[key]
    const filePath = this.pathResolver.resolveFilePath(resolver)

    if (filePath == null) return null

    return {
      path: filePath,
      name: resolver.name
    }
  }

  resolveManualImport (resolver: Resolver): ResolvedImport | null {
    const filePath = this.pathResolver.resolveFilePath(resolver)

    if (filePath == null) return null

    return {
      path: filePath,
      name: resolver.name
    }
  }
}
