import type {
  Field,
  Tab,
} from 'payload'

import type { ResolvedFieldSelection } from '#types.ts'

export function resolveFieldByPath(fields: Field[], segments: string[], currentPath: string[] = []): Omit<ResolvedFieldSelection, 'selector'> | undefined {
  const [
    currentSegment,
    ...rest
  ] = segments

  for (const field of fields) {
    if (field.type === 'tabs') {
      const resolvedInTabs = resolveTabFieldByPath(field.tabs, segments, currentPath)

      if (resolvedInTabs) {
        return resolvedInTabs
      }
    }

    if ('name' in field && field.name === currentSegment) {
      const nextPath = [
        ...currentPath,
        currentSegment,
      ]

      if (rest.length === 0) {
        return {
          dataPath: nextPath,
          field,
        }
      }

      const nestedFields = getNestedFields(field)

      if (nestedFields) {
        return resolveFieldByPath(nestedFields, rest, nextPath)
      }

      return undefined
    }

    const transparentNestedFields = getTransparentNestedFields(field)

    if (transparentNestedFields) {
      const resolved = resolveFieldByPath(transparentNestedFields, segments, currentPath)

      if (resolved) {
        return resolved
      }
    }
  }

  return undefined
}

export function findUniqueFieldByName(fields: Field[], fieldName: string): Omit<ResolvedFieldSelection, 'selector'> | undefined {
  const topLevelMatches = fields.flatMap((field) => {
    if ('name' in field && field.name === fieldName) {
      return [
        {
          dataPath: [
            field.name,
          ],
          field,
        },
      ]
    }

    return []
  })

  if (topLevelMatches.length > 1) {
    throw new Error(`Field selector "${fieldName}" is ambiguous. Use a dotted path instead.`)
  }

  if (topLevelMatches.length === 1) {
    return topLevelMatches[0]
  }

  const matches = collectFieldMatches(fields, fieldName)

  if (matches.length > 1) {
    throw new Error(`Field selector "${fieldName}" is ambiguous. Use a dotted path instead.`)
  }

  return matches[0]
}

function collectFieldMatches(fields: Field[], fieldName: string, currentPath: string[] = []): Omit<ResolvedFieldSelection, 'selector'>[] {
  const matches: Omit<ResolvedFieldSelection, 'selector'>[] = []

  for (const field of fields) {
    if (field.type === 'tabs') {
      matches.push(...collectTabFieldMatches(field.tabs, fieldName, currentPath))
    }

    if ('name' in field && field.name === fieldName) {
      matches.push({
        dataPath: [
          ...currentPath,
          field.name,
        ],
        field,
      })
    }

    const namedNestedFields = getNestedFields(field)

    if ('name' in field && typeof field.name === 'string' && namedNestedFields) {
      matches.push(...collectFieldMatches(namedNestedFields, fieldName, [
        ...currentPath,
        field.name,
      ]))
    }

    const transparentNestedFields = getTransparentNestedFields(field)

    if (transparentNestedFields) {
      matches.push(...collectFieldMatches(transparentNestedFields, fieldName, currentPath))
    }
  }

  return matches
}

function getNestedFields(field: Field): Field[] | undefined {
  switch (field.type) {
    case 'array':
    case 'collapsible':
    case 'group':
    case 'row':
      return field.fields

    default:
      return undefined
  }
}

function getTransparentNestedFields(field: Field): Field[] | undefined {
  switch (field.type) {
    case 'row':
      return field.fields

    default:
      return undefined
  }
}

function resolveTabFieldByPath(
  tabs: Tab[],
  segments: string[],
  currentPath: string[],
): Omit<ResolvedFieldSelection, 'selector'> | undefined {
  const [
    currentSegment,
    ...rest
  ] = segments

  for (const tab of tabs) {
    if ('name' in tab && typeof tab.name === 'string' && tab.name === currentSegment) {
      if (rest.length === 0) {
        return undefined
      }

      return resolveFieldByPath(tab.fields, rest, [
        ...currentPath,
        tab.name,
      ])
    }

    const resolved = resolveFieldByPath(tab.fields, segments, currentPath)

    if (resolved) {
      return resolved
    }
  }

  return undefined
}

function collectTabFieldMatches(
  tabs: Tab[],
  fieldName: string,
  currentPath: string[],
): Omit<ResolvedFieldSelection, 'selector'>[] {
  const matches: Omit<ResolvedFieldSelection, 'selector'>[] = []

  for (const tab of tabs) {
    if ('name' in tab && typeof tab.name === 'string') {
      matches.push(...collectFieldMatches(tab.fields, fieldName, [
        ...currentPath,
        tab.name,
      ]))

      continue
    }

    matches.push(...collectFieldMatches(tab.fields, fieldName, currentPath))
  }

  return matches
}
