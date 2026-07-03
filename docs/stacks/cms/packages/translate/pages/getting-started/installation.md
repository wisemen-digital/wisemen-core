---
title: Installation
layout: doc
---

# Installation

`@wisemen/payload-core-translate` is a Payload CMS plugin that adds document translation flows, adapter support, and translation status tracking.

## Install

The package is workspace-local, so you can import it directly from the monorepo package:

```ts
import {
  deeplTranslateAdapterDefinition,
  defineTranslatableCollection,
  googleTranslateAdapterDefinition,
  payloadTranslatePlugin,
} from "@wisemen/payload-core-translate";
```

## Basic setup

```ts
import { buildConfig } from 'payload'
import {
  defineTranslatableCollection,
  googleTranslateAdapterDefinition,
  payloadTranslatePlugin,
} from '@wisemen/payload-core-translate'

export default buildConfig({
  plugins: [
    payloadTranslatePlugin({
      adapters: [googleTranslateAdapterDefinition],
      collections: [
        defineTranslatableCollection<Article>({
          slug: 'articles',
          translatableFields: ['title', 'body'],
        }),
      ],
      translations: {
        type: 'collection',
        slug: 'translationSettings',
      },
    }),
  ],
})
```

## What it adds

- A translation action in collection edit screens.
- Field selection for the fields that should be translated.
- Translation status columns and hooks that keep translated content in sync.
- Optional translation settings storage in a Payload global or collection.
- Adapter-based translation, including Google Translate and DeepL.

## Adapter setup

Each adapter definition can expose its own config fields and runtime translator.

- `googleTranslateAdapterDefinition`
- `deeplTranslateAdapterDefinition`

For a full breakdown of adapter options and behavior, see the [Adapters](/cms/packages/translate/pages/getting-started/adapters) page.

When you configure more than one adapter, editors can choose the service from the translation modal.

## Translation storage

Use `translations` to store adapter configuration in either a global or a collection.

```ts
translations: {
  type: 'global',
  slug: 'translationSettings',
}
```

or:

```ts
translations: {
  type: 'collection',
  slug: 'translationSettings',
}
```

## Access control

You can gate both the translation endpoint and the rendered translation settings field with an `access` function.

```ts
payloadTranslatePlugin({
  access: async ({ req, collectionSlug, document }) => {
    if (!req.user) return false
    if (collectionSlug === 'restricted') return false
    return Boolean(document)
  },
  adapters: [googleTranslateAdapterDefinition],
  collections,
  translations: {
    type: 'collection',
    slug: 'translationSettings',
  },
})
```

## Notes

- `adapters` is required.
- The runtime tries adapters in order and falls back to the next one if a translation fails.
- The full source document is passed to every adapter.
