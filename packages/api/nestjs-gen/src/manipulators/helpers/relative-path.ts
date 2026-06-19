import path from 'path'
import { getImportStyle } from './import-style.js'

export function getRelativePath (targetPath: string, sourcePath: string): string {
  if (getImportStyle() === 'alias') {
    const aliasPath = getAliasPath(sourcePath)

    if (aliasPath != null) {
      return aliasPath
    }
  }
  const relativePath = path.relative(path.dirname(targetPath), sourcePath)
    .replace(/\\/g, '/')
    .replace(/\.ts$/, '.js')

  if (!relativePath.startsWith('.') && !relativePath.startsWith('/')) {
    return `./${relativePath}`
  } else {
    return relativePath
  }
}

function getAliasPath (sourcePath: string): string | null {
  const normalizedPath = sourcePath.replace(/\\/g, '/')

  const srcMatch = normalizedPath.match(/(?:^|\/)(src\/.+)$/)

  if (srcMatch != null) {
    return `#${srcMatch[1]}`.replace(/\.ts$/, '.js')
  }

  const testMatch = normalizedPath.match(/(?:^|\/)(test\/.+)$/)

  if (testMatch != null) {
    return `#${testMatch[1]}`.replace(/\.ts$/, '.js')
  }

  return null
}
