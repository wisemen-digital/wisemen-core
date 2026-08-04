---
title: Installation
layout: doc
---

# Installation

`@wisemen-core/payload-core-seeder` provides repeatable, type-safe seed data for Payload. Seed records use stable `_key` values and `ref(...)` tokens instead of database IDs, so the package can determine creation order and resolve relationships for you.

## Install

```bash
pnpm add @wisemen-core/payload-core-seeder
```

The package requires Payload 3 and React 19.

## Project structure

Keep one definition per collection or global, and collect them in one array. The Payload Nuxt monorepo template uses this structure:

```text
apps/cms/src/seeders/
  definitions/
    images.seed.ts
    pages.seed.ts
    seederKeys.ts
    index.ts
  utils/
```

`seederKeys.ts` is a useful home for stable keys and typed reference helpers. It keeps references readable and avoids repeating raw strings throughout the seed data.

```ts
import { ref } from '@wisemen-core/payload-core-seeder'

export const SEEDERS = {
  IMAGE: {
    PLACEHOLDER: 'placeholder',
  },
  TENANT: {
    DEFAULT: 'default',
  },
} as const

export function getSeedImageRef(key: typeof SEEDERS.IMAGE[keyof typeof SEEDERS.IMAGE]) {
  return ref('images', key)
}

export function getSeedTenantRef() {
  return ref('tenants', SEEDERS.TENANT.DEFAULT)
}
```

## Define seed data

Use `defineSeed(...)` for each collection or global. Collection definitions return an array; global definitions return one object. A collection record needs a unique `_key`, which is used only to resolve references during the seed run.

```ts
import { defineSeed } from '@wisemen-core/payload-core-seeder'

import {
  getSeedImageRef,
  getSeedTenantRef,
  SEEDERS,
} from './seederKeys'

export const pagesSeed = defineSeed('pages', () => [
  {
    _key: 'home',
    _status: 'published',
    title: {
      en: 'Home',
      nl: 'Startpagina',
    },
    heroImage: getSeedImageRef(SEEDERS.IMAGE.PLACEHOLDER),
    tenant: getSeedTenantRef(),
  },
])
```

The package validates collection and global slugs, duplicate keys, top-level field names, and every `ref(...)` before changing data. References are resolved after their target record has been created. Cyclic optional relationships are deferred and written once all involved documents exist.

## Register the plugin

Export all definitions from an index file and pass them to `seedPlugin(...)` in `payload.config.ts`.

```ts
import { seedPlugin } from '@wisemen-core/payload-core-seeder'

import { seedDefinitions } from '#seeders/definitions'

export default buildConfig({
  plugins: [
    seedPlugin({
      definitions: seedDefinitions,
      options: {
        access: {
          run: (req) => Boolean(req.user?.roles?.includes('admin')),
        },
        assetsDir: 'public/seeder',
        assetSubDirs: {
          images: '',
        },
      },
    }),
  ],
})
```

The plugin adds the `payload seed` command and a protected `POST /api/seed` endpoint. The endpoint access rule defaults to any logged-in Payload user; set `options.access.run` when seeding should be restricted further.

Add a convenient app script:

```json
{
  "scripts": {
    "seed": "payload seed"
  }
}
```

Run it with:

```bash
pnpm seed
```

## Seed upload files

For a normal Payload upload collection, use `_file` and place the source file in the configured asset directory. By default, files are searched in `assets/<collection-slug>/` and then directly in `assets/`.

```ts
import { defineSeed } from '@wisemen-core/payload-core-seeder'

export const imagesSeed = defineSeed('images', ({ file }) => [
  {
    _key: 'placeholder',
    _file: file('placeholder.jpg'),
    alt: {
      en: 'Placeholder image',
      nl: 'Tijdelijke afbeelding',
    },
  },
])
```

`assetSubDirs` overrides the default subdirectory per collection. Use `''` when files live directly under `assetsDir`, as in the template’s `public/seeder/placeholder.jpg` example.

For a non-upload collection that stores a file path in a field, set `custom.seedAsset` on its collection config:

```ts
custom: {
  seedAsset: {
    sourceField: 'source',
    subdir: 'files',
  },
}
```

The runner then writes the resolved file and any `file(...)` options to that field instead of creating a Payload upload.

## Localized fields

When Payload localization is enabled, write localized values as locale maps. The runner creates the document once and writes each configured locale, including locale maps nested in groups, blocks, and rich text data.

```ts
{
  title: {
    en: 'About us',
    nl: 'Over ons',
  },
}
```

Use `options.locales` to seed only a subset of your configured Payload locales.

## Controlling a definition

Pass options as the third argument to `defineSeed(...)`:

```ts
defineSeed('tenantPresets', () => [/* records */], {
  skipIfExists: true,
})
```

`skipIfExists` retains an existing collection and reuses its records for seed references. It requires the existing record count to match the definition.

You can disable a collection’s seed definition without changing its data file:

```ts
custom: {
  seedDisabled: 'Not used in this deployment',
}
```

References to skipped definitions are removed from optional top-level fields. A reference from a required field stops the seed run with a validation error.

## Notes

- Seeded collections are cleared before they are recreated, except definitions that use `skipIfExists`.
- Globals are updated rather than cleared.
- Missing `_file` source files are logged and skipped; the record is still created.
- Set `enabled: false` on `seedPlugin(...)` to register no seed command, endpoint, or generated seed types.
