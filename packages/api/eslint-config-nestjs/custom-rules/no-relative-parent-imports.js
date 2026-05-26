import { existsSync, readFileSync } from 'fs'
import { resolve, dirname, join, relative, normalize } from 'path'

function parseJsonc (content) {
  const stripped = content
    .replace(/\/\/[^\n\r]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
  try {
    return JSON.parse(stripped)
  } catch {
    return {}
  }
}

function has (map, path) {
  let inner = map
  for (const step of path.split('.')) {
    inner = inner[step]
    if (inner === undefined) {
      return false
    }
  }
  return true
}

function findDirWithFile (filename) {
  let dir = resolve(filename)

  do {
    dir = dirname(dir)
  } while (!existsSync(join(dir, filename)) && dir !== '/')

  if (!existsSync(join(dir, filename))) {
    return
  }

  return dir
}

function getImportPrefixToAlias (paths) {
  const reversed = {}
  for (const key of Object.keys(paths)) {
    for (const path of paths[key]) {
      reversed[path] = key
    }
  }
  return reversed
}

function getBaseUrlAndPaths (baseDir) {
  let url = ''
  let paths = {}

  if (existsSync(join(baseDir, 'tsconfig.json'))) {
    const tsconfig = parseJsonc(
      readFileSync(join(baseDir, 'tsconfig.json')).toString()
    )
    if (has(tsconfig, 'compilerOptions.baseUrl')) {
      url = tsconfig.compilerOptions.baseUrl
    }
    if (has(tsconfig, 'compilerOptions.paths')) {
      paths = tsconfig.compilerOptions.paths
    }
  } else if (existsSync(join(baseDir, 'jsconfig.json'))) {
    const jsconfig = parseJsonc(
      readFileSync(join(baseDir, 'jsconfig.json')).toString()
    )
    if (has(jsconfig, 'compilerOptions.baseUrl')) {
      url = jsconfig.compilerOptions.baseUrl
    }
    if (has(jsconfig, 'compilerOptions.paths')) {
      paths = jsconfig.compilerOptions.paths
    }
  }

  return [join(baseDir, url), paths]
}

function getExpectedPath (absolutePath, baseUrl, importPrefixToAlias, onlyPathAliases, onlyAbsoluteImports) {
  const relativeToBasePath = relative(baseUrl, absolutePath)
  if (!onlyAbsoluteImports) {
    for (const prefix of Object.keys(importPrefixToAlias)) {
      const aliasPath = importPrefixToAlias[prefix]
      // assuming they are either a full path or a path ends with /*, which are the two standard cases
      const importPrefix = prefix.endsWith('/*') ? prefix.replace('/*', '') : prefix
      const aliasImport = aliasPath.endsWith('/*') ? aliasPath.replace('/*', '') : aliasPath
      if (relativeToBasePath.startsWith(importPrefix)) {
        return `${aliasImport}${relativeToBasePath.slice(importPrefix.length)}`
      }
    }
  }
  if (!onlyPathAliases) {
    return relativeToBasePath
  }
}

const optionsSchema = {
  type: 'object',
  properties: {
    onlyPathAliases: {
      type: 'boolean',
    },
    onlyAbsoluteImports: {
      type: 'boolean',
    },
  },
}

function generateRule (context, errorMessagePrefix, importPathConditionCallback) {
  const options = context.options[0] || {}
  const onlyPathAliases = options.onlyPathAliases || false
  const onlyAbsoluteImports = options.onlyAbsoluteImports || false

  const baseDir = findDirWithFile('package.json')
  const [baseUrl, paths] = getBaseUrlAndPaths(baseDir)
  const importPrefixToAlias = getImportPrefixToAlias(paths)

  return {
    ImportDeclaration (node) {
      const source = node.source.value
      if (importPathConditionCallback(source)) {
        const filename = context.filename

        const absolutePath = normalize(
          join(dirname(filename), source)
        )
        const expectedPath = getExpectedPath(
          absolutePath,
          baseUrl,
          importPrefixToAlias,
          onlyPathAliases,
          onlyAbsoluteImports,
        )

        if (expectedPath && source !== expectedPath) {
          context.report({
            node,
            message: `${errorMessagePrefix}. Use \`${expectedPath}\` instead of \`${source}\`.`,
            fix (fixer) {
              return fixer.replaceText(node.source, `'${expectedPath}'`)
            },
          })
        }
      }
    },
  }
}

export const rules = {
  'no-relative-import': {
    meta: {
      fixable: 'code',
      schema: [optionsSchema],
    },
    create (context) {
      return generateRule(
        context,
        'Relative imports are not allowed',
        source => source.startsWith('.'),
      )
    },
  },
  'no-relative-parent-imports': {
    meta: {
      fixable: 'code',
      schema: [optionsSchema],
    },
    create (context) {
      return generateRule(
        context,
        'Relative imports from parent directories are not allowed',
        source => source.startsWith('..'),
      )
    },
  },
}