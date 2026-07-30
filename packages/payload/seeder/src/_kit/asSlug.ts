// GENERATED — DO NOT EDIT. Source: tools/plugin-kit/src/asSlug.ts
// Vendored by `pnpm kit:sync`; `pnpm kit:check` fails if this drifts from the source.
import type { CollectionSlug } from 'payload'

/**
 * A slug read back off a merged `CollectionConfig` is a `string` — that's the type Payload gives
 * it, and a renamed collection's slug is only known at runtime. In a consumer app whose generated
 * types are in scope, `CollectionSlug` narrows to a union of that app's literal slugs, so handing
 * the string to `relationTo` or `payload.find` fails to compile *in the app*, not here — which is
 * why a plugin's own typecheck can't catch it.
 *
 * Every plugin that follows a rename crosses that boundary, so it crosses it in one place, named.
 * The cast is the point: the slug is whatever the app called the collection, and no type in this
 * package can know that.
 */
export const asSlug = (slug: string): CollectionSlug => slug as CollectionSlug
