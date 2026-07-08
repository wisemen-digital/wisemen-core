import fs from 'fs'
import path from 'path'

export type ImportStyle = 'relative' | 'alias'

let cachedImportStyle: ImportStyle | null = null

function detectImportStyle (): ImportStyle {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json')

  try {
    const content = fs.readFileSync(packageJsonPath, 'utf-8')
    const packageJson = JSON.parse(content) as Record<string, unknown>

    if (packageJson.imports != null && typeof packageJson.imports === 'object') {
      const imports = packageJson.imports as Record<string, unknown>

      if (Object.keys(imports).some(key => key.startsWith('#src'))) {
        return 'alias'
      }
    }
  } catch {
    //
  }

  return 'relative'
}

export function getImportStyle (): ImportStyle {
  if (cachedImportStyle == null) {
    cachedImportStyle = detectImportStyle()
  }

  return cachedImportStyle
}
