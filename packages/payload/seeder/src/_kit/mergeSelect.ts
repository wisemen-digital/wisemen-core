/* eslint-disable check-file/folder-naming-convention */
// GENERATED — DO NOT EDIT. Source: tools/plugin-kit/src/mergeSelect.ts
// Vendored by `pnpm kit:sync`; `pnpm kit:check` fails if this drifts from the source.
import type {
  CollectionConfig,
  SelectIncludeType,
} from 'payload'

// Deliberately stricter than the kit's `isRecord`, which lets arrays through: a select is an object
// literal, and an array here would be Object.assign'd key-by-index into the accumulator.
const isSelectObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

// A plugin's selects are include-mode ({ field: true }); Object.assign merges them into a typed
// accumulator without a cast (it doesn't re-check each copied value against SelectIncludeType).
export function mergeSelect(
  base: CollectionConfig['defaultPopulate'],
  override: CollectionConfig['defaultPopulate'],
): SelectIncludeType | undefined {
  if (!base && !override) {
    return undefined
  }
  const out: SelectIncludeType = {}

  if (isSelectObject(base)) {
    Object.assign(out, base)
  }
  if (isSelectObject(override)) {
    Object.assign(out, override)
  }

  return out
}
