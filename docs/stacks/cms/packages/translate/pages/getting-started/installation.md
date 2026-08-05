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
  localization: {
    defaultLocale: 'en',
    locales: ['en', 'nl', 'fr'],
  },
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

For every collection you register through `collections`, the plugin mutates the collection config and adds:

- a localized `translationStatus` field in the sidebar
- a `translationStatus` default admin column
- a translate action in the collection edit menu
- a `beforeChange` hook that marks edited translations as manually edited
- an `afterChange` hook that marks translated sibling locales as stale when the source locale changes

It also adds a translation endpoint at `POST /translate-locale/:collection`.

If you configure `translations`, it also ensures adapter settings are stored in either:

- a Payload collection, or
- a Payload global

That settings target gets a `translations` group with one tab per adapter.

`translatableFields` controls which fields are translated and tracked for status changes.

`ignoredFields` lets you exclude fields from stale-status detection while still keeping them in the translation config.

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

If the target already exists, the plugin injects the translation settings fields into it. If it does not exist yet, the plugin creates the collection or global for you.

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
- The package is most useful when Payload localization is enabled.
