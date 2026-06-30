import { Project, SourceFile, Node } from 'ts-morph'

export type ResolveType = 'class' | 'enum' | 'alias' | 'function' | 'interface'
export type Resolver = {
  glob: string
  type: ResolveType
  name: string
}

export class PathResolver {
  private project = new Project()
  private cache = new Map<string, string | null>()

  resolveFilePath (resolver: Resolver): string | null {
    const cached = this.cache.get(resolver.name)

    if (cached !== undefined) return cached

    const files = this.project.addSourceFilesAtPaths(resolver.glob)
    const nodes = this.findNodes(files, resolver.name, resolver.type)
    const filePath = this.getFilePath(nodes)

    this.cache.set(resolver.name, filePath)

    return filePath
  }

  private findNodes (files: SourceFile[], name: string, type: ResolveType): Node[] {
    switch (type) {
      case 'class':
        return this.findClasses(files, name)
      case 'enum':
        return this.findEnums(files, name)
      case 'alias':
        return this.findAliases(files, name)
      case 'function':
        return this.findFunctions(files, name)
      case 'interface':
        return this.findInterfaces(files, name)
    }
  }

  private findClasses (files: SourceFile[], key: string): Node[] {
    return files.flatMap((sourceFile) => {
      return sourceFile.getClasses().filter(c => c.getName() === key)
    })
  }

  private findEnums (files: SourceFile[], key: string): Node[] {
    return files.flatMap((sourceFile) => {
      return sourceFile.getEnums().filter(e => e.getName() === key)
    })
  }

  private findAliases (files: SourceFile[], key: string): Node[] {
    return files.flatMap((sourceFile) => {
      return sourceFile.getTypeAliases().filter(alias => alias.getName() === key)
    })
  }

  private findFunctions (files: SourceFile[], key: string): Node[] {
    return files.flatMap((sourceFile) => {
      return sourceFile.getFunctions().filter(fn => fn.getName() === key)
    })
  }

  private findInterfaces (files: SourceFile[], key: string): Node[] {
    return files.flatMap((sourceFile) => {
      return sourceFile.getInterfaces().filter(i => i.getName() === key)
    })
  }

  private getFilePath (nodes: Node[]): string | null {
    if (nodes.length === 0) return null
    if (nodes.length > 1) throw new Error(`Multiple matches found: ${nodes.map(n => n.getSourceFile().getFilePath()).join(', ')}`)

    return nodes[0].getSourceFile().getFilePath()
  }
}
