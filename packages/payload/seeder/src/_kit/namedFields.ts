/* eslint-disable check-file/folder-naming-convention */
// GENERATED — DO NOT EDIT. Source: tools/plugin-kit/src/namedFields.ts
// Vendored by `pnpm kit:sync`; `pnpm kit:check` fails if this drifts from the source.
import type { CollectionConfig } from 'payload'

// Data-level field names in an array, recursing only into presentational containers (row,
// collapsible, unnamed tabs) — their children share the parent's level for name uniqueness.
export function namedFields(fields: CollectionConfig['fields']): string[] {
  return fields.flatMap((f) => {
    if ('name' in f && typeof f.name === 'string') {
      return [
        f.name,
      ]
    }
    if ('fields' in f && Array.isArray(f.fields)) {
      return namedFields(f.fields)
    }
    if (f.type === 'tabs') {
      return f.tabs.flatMap((t) => ('name' in t && t.name ? [] : namedFields(t.fields)))
    }

    return []
  })
}
