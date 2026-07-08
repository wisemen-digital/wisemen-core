# `@repo/payload-translate`

Payload plugin for translating documents with one or more adapters.

## What it does

- Adds a translation action to collection edit screens.
- Translates selected fields into one or more target locales.
- Keeps translation status in sync on translated collections.
- Lets you store adapter credentials in Payload, either in a global or a collection.
- Supports an optional `access` gate for both the translation endpoint and the rendered translation settings field.

## Install

This package is workspace-local, so you usually import it directly from the monorepo package:

```ts
import { payloadTranslatePlugin, googleTranslateAdapterDefinition } from "@repo/payload-translate";
```

## Basic usage

```ts
import { payloadTranslatePlugin, googleTranslateAdapterDefinition } from "@repo/payload-translate";

export default buildConfig({
  plugins: [
    payloadTranslatePlugin({
      adapters: [googleTranslateAdapterDefinition],
      collections: [
        defineTranslatableCollection<Article>({
          slug: "articles",
          translatableFields: ["title", "body"],
          ignoredFields: ["seo.slug"],
        }),
      ],
      translations: {
        type: "collection",
        slug: "translationSettings",
      },
    }),
  ],
});
```

## Adapters

Pass every adapter you want to support through `adapters`.

Each adapter definition can provide:

- `key`: the stored config key
- `label`: the admin tab label
- `fields`: the editable Payload fields shown in the `translations` settings document
- `create(options)`: returns the runtime translation adapter

The package ships with a Google adapter definition:

- `googleTranslateAdapterDefinition`

Google adapter settings:

- `apiKey`
- `apiURL`
- `fallbackApiURL`

Example:

```ts
adapters: [googleTranslateAdapterDefinition];
```

The package also ships with a DeepL adapter definition:

- `deeplTranslateAdapterDefinition`

DeepL adapter settings:

- `apiKey`
- `apiURL`

Example:

```ts
adapters: [deeplTranslateAdapterDefinition];
```

When you configure more than one adapter, the translation modal shows a
`Translation service` dropdown so editors can choose which service to use for
that translation run.

## Translation settings storage

Use `translations` to tell the plugin where to store adapter configuration.

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

The plugin injects a `translations` group with one tab per configured adapter.

Use `ignoredFields` for fields that can be edited without changing the
translation status. They still translate normally, but editing them will not
flip a locale to `manually edited` or mark sibling locales stale.

## Access

You can optionally gate both:

- the translation endpoint
- the rendered translation settings field

```ts
payloadTranslatePlugin({
  access: async ({ req, collectionSlug, document }) => {
    if (!req.user) return false;
    if (collectionSlug === "restricted") return false;
    return Boolean(document);
  },
  adapters: [googleTranslateAdapterDefinition],
  collections,
  translations: {
    type: "collection",
    slug: "translationSettings",
  },
});
```

If `access` returns `false`, the endpoint responds with `403`, and the `translations` field will not render in admin.

## Rich text heuristics

You can extend the built-in rich text detection rules:

```ts
payloadTranslatePlugin({
  adapters: [googleTranslateAdapterDefinition],
  collections,
  richText: {
    metaKeys: ["myMetaKey"],
    skipKeys: ["mySkipKey"],
    optionKeyPatterns: [/myOption$/i],
  },
});
```

## Notes

- `adapters` is required.
- The runtime tries adapters in order and falls back to the next one if a translation fails.
- The full source document is passed to each adapter, even if the adapter does not need it today.
