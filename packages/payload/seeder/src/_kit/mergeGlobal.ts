/* eslint-disable check-file/folder-naming-convention */
// GENERATED — DO NOT EDIT. Source: tools/plugin-kit/src/mergeGlobal.ts
// Vendored by `pnpm kit:sync`; `pnpm kit:check` fails if this drifts from the source.
import type { GlobalConfig } from 'payload'

import { mergeHooks } from './mergeHooks'

/** The `globals.<name>` counterpart of mergeCollection — same rules, fewer keys. */
export function mergeGlobal(base: GlobalConfig, override?: Partial<GlobalConfig>): GlobalConfig {
  if (!override) {
    return base
  }

  return {
    ...base,
    ...override,
    fields: [
      ...base.fields,
      ...(override.fields ?? []),
    ],
    hooks: override.hooks ? mergeHooks(base.hooks ?? {}, override.hooks) : base.hooks,
    slug: override.slug ?? base.slug,
    // Spread in only when one side has it — see mergeCollection.
    ...(base.access || override.access
      ? {
          access: {
            ...base.access,
            ...override.access,
          },
        }
      : {}),
    ...(base.admin || override.admin
      ? {
          admin: {
            ...base.admin,
            ...override.admin,
          },
        }
      : {}),
    ...(base.custom || override.custom
      ? {
          custom: {
            ...base.custom,
            ...override.custom,
          },
        }
      : {}),
  }
}
