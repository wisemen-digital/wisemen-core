// GENERATED — DO NOT EDIT. Source: tools/plugin-kit/src/mergeCollection.ts
// Vendored by `pnpm kit:sync`; `pnpm kit:check` fails if this drifts from the source.
import type { CollectionConfig } from 'payload'

import { mergeHooks } from './mergeHooks'
import { mergeSelect } from './mergeSelect'
import { namedFields } from './namedFields'

/**
 * Every `collections.<name>` override, in every plugin, merges by these rules:
 *
 * - `slug`     — renamed. The plugin propagates the new slug to every internal reference.
 * - `fields`   — appended after the plugin's; a duplicate name is a boot error.
 * - `hooks`    — merged per phase (yours run after the plugin's).
 * - `access` / `admin` / `upload` / `custom` — shallow-merged.
 * - `defaultPopulate` / `forceSelect` — merged as selects.
 * - everything else — replaced.
 *
 * The rule of thumb: anything the plugin depends on is merged, never clobbered; anything else is
 * yours. Renaming is a first-class override rather than a forbidden one, which is why there's no
 * `extendCollection` — you rename the plugin's collection and add your fields to it.
 */
export function mergeCollection(base: CollectionConfig, override?: Partial<CollectionConfig>): CollectionConfig {
  if (!override) { return base }

  return {
    ...base,
    ...override,
    fields: [
      ...base.fields,
      ...(override.fields ?? []),
    ],
    hooks: override.hooks ? mergeHooks(base.hooks ?? {}, override.hooks) : base.hooks,
    slug: override.slug ?? base.slug,
    // Each of these is spread in only when one side actually has it. Merging unconditionally would
    // put `admin: {}` on a collection that declared none, and `upload: undefined` on one that isn't
    // an upload collection — which reads as "present but empty" to anything testing `'upload' in c`.
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
    ...(base.upload || override.upload
      ? {
          upload:
            override.upload && typeof override.upload === 'object' && typeof base.upload === 'object'
              ? {
                  ...base.upload,
                  ...override.upload,
                }
              : (override.upload ?? base.upload),
        }
      : {}),
    ...(base.defaultPopulate || override.defaultPopulate
      ? {
          defaultPopulate: mergeSelect(base.defaultPopulate, override.defaultPopulate),
        }
      : {}),
    ...(base.forceSelect || override.forceSelect
      ? {
          forceSelect: mergeSelect(base.forceSelect, override.forceSelect),
        }
      : {}),
  }
}

/**
 * Fields append on merge, so a field of yours named like one the plugin injects would reach Payload
 * as a bare DuplicateFieldName with no hint which plugin put the second one there. Say it plainly
 * instead, naming the plugin, the option key, and the fields.
 *
 * `key` is the `collections` KEY the reader typed (`muxVideo`, `generatedImages`) — never the slug.
 * The message tells them where to go and edit, and a renamed collection's slug isn't a key that
 * exists in their config.
 */
export function assertNoFieldCollisions(
  plugin: string,
  key: string,
  base: CollectionConfig['fields'],
  override?: CollectionConfig['fields'],
): void {
  if (!override?.length) { return }
  const injected = new Set(namedFields(base))
  const collisions = namedFields(override).filter((n) => injected.has(n))

  if (collisions.length > 0) {
    throw new Error(
      `[${plugin}] collections.${key}: field(s) ${collisions.join(', ')} are already defined by the plugin — rename or remove them.`,
    )
  }
}
