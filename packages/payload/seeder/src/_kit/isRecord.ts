// GENERATED — DO NOT EDIT. Source: tools/plugin-kit/src/isRecord.ts
// Vendored by `pnpm kit:sync`; `pnpm kit:check` fails if this drifts from the source.
/**
 * Narrows `unknown` to an indexable object — for reading untrusted shapes (a webhook body, a
 * `custom` stash, a hand-built config) without an `as`.
 *
 * Arrays pass: they ARE objects, and every call site here either reads a named key off the value
 * (an array yields `undefined`, which is the right answer) or has already established the shape.
 * Where "a record, and specifically not an array" is the question — `mergeSelect` deciding whether
 * a select is an object literal — that check is stricter and lives with the code that needs it.
 */
export const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null
