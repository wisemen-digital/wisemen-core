// GENERATED — DO NOT EDIT. Source: tools/plugin-kit/src/collectionOption.ts
// Vendored by `pnpm kit:sync`; `pnpm kit:check` fails if this drifts from the source.
import type {
  CollectionConfig,
  GlobalConfig,
} from 'payload'

/**
 * The uniform shape of a `collections.<name>` entry. Every plugin reads a collection the same way:
 * rename it, pass Payload-level overrides the merge kit applies, and set this plugin's own knobs for
 * it under `options`. A collection the plugin can work without also takes `false` to opt out —
 * express that at the use site as `CollectionOption<O> | false`.
 *
 * The split is the point: `overrides` is anything Payload's `CollectionConfig` has (merged, not
 * clobbered), `options` is this plugin's vocabulary for the collection, and neither leaks into the
 * other.
 */
export interface CollectionOption<O = Record<string, never>> {
  /** This plugin's own options for this collection. */
  options?: O
  /**
   * Payload `CollectionConfig` keys, merged onto the plugin's: fields append, hooks merge per
   * phase, access / admin / upload / custom shallow-merge, everything else replaces. `slug` is
   * excluded — rename with the sibling `slug` key, which the plugin threads; a `slug` buried here
   * would rename the collection while the plugin's internal references stayed on the old name.
   */
  overrides?: Omit<Partial<CollectionConfig>, 'slug'>
  /** Rename the collection. The plugin follows the new slug through every internal reference. */
  slug?: string
}

/** The `globals.<name>` counterpart of {@link CollectionOption} — same split, `GlobalConfig`. */
export interface GlobalOption<O = Record<string, never>> {
  options?: O
  overrides?: Omit<Partial<GlobalConfig>, 'slug'>
  slug?: string
}
