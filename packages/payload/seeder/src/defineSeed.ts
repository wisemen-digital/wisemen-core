import type {
  CollectionSlug,
  GlobalSlug,
} from 'payload'

import {
  file,
  ref,
} from './refs'
import type {
  CollectionSeedData,
  CollectionSeedDefinition,
  DefinitionFor,
  GlobalSeedData,
  GlobalSeedDefinition,
  SeedDefinitionOptions,
  SeedTokens,
} from './types'

const tokens = {
  file,
  ref,
}

export function defineSeed<TSlug extends CollectionSlug>(
  slug: TSlug,
  build: (tokens: SeedTokens) => Array<CollectionSeedData<TSlug>>,
  opts?: SeedDefinitionOptions,
): CollectionSeedDefinition<TSlug>

export function defineSeed<TSlug extends GlobalSlug>(
  slug: TSlug,
  build: (tokens: SeedTokens) => GlobalSeedData<TSlug>,
  opts?: SeedDefinitionOptions,
): GlobalSeedDefinition<TSlug>

export function defineSeed<TSlug extends CollectionSlug | GlobalSlug>(
  slug: TSlug,
  build: (tokens: SeedTokens) => Array<CollectionSeedData<CollectionSlug>> | GlobalSeedData<GlobalSlug>,
  opts?: SeedDefinitionOptions,
): DefinitionFor<TSlug> {
  let built: unknown

  try {
    built = build(tokens)
  }
  catch (error) {
    throw new Error(`[payload-seed] defineSeed('${slug}'): builder threw during classification: ${error instanceof Error ? error.message : String(error)}`)
  }
  const kind = Array.isArray(built) ? 'collection' : 'global'

  // EXCUSE: DefinitionFor<TSlug> is a deferred conditional type (collection-vs-global on the generic TSlug);
  //  TS can't verify a runtime-built object matches it, so the return needs a bridge cast
  return {
    build,
    kind,
    slug,
    ...(opts?.disabled !== undefined
      ? {
          disabled: opts.disabled,
        }
      : {}),
    ...(opts?.skipIfExists
      ? {
          skipIfExists: true,
        }
      : {}),
  } as unknown as DefinitionFor<TSlug>
}

export { tokens }
