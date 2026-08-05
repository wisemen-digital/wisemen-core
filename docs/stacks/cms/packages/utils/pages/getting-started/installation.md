---
title: Installation
layout: doc
---

# Installation

`@wisemen/payload-core-utils` is the shared runtime layer used by the other Payload packages in this repo.

It does not add collections by itself. Instead, it registers project-specific helpers and shared defaults that packages like `auth`, `links`, and `settings` can call.

## Install

```ts
import { payloadUtilsPlugin } from '@wisemen/payload-core-utils'
```

## Basic setup

```ts
import { payloadUtilsPlugin } from '@wisemen/payload-core-utils'

export default buildConfig({
  plugins: [
    payloadUtilsPlugin({
      fallbackLocale: 'en',
      locales: ['en', 'nl'],
      defaultLinkableCollections: ['pages', 'articles', 'services'],
      defaultEvents: [
        {
          id: 'open_calculator',
          label: {
            en: 'Open calculator',
            nl: 'Open calculator',
          },
        },
        {
          id: 'open_contact_modal',
          label: 'Open contact modal',
        },
      ],
      getPayload: async () => payload,
      getTenantQuery: (tenantId) => ({
        tenant: {
          equals: tenantId,
        },
      }),
      getSimpleRichTextField: ({
        label,
        localized,
        name,
        required,
      }) => ({
        name,
        label,
        localized,
        required,
        type: 'richText',
      }),
    }),
  ],
})
```

## What it adds

This package initializes shared runtime functions:

- `getPayload()`
- `getTenantQuery(tenantId)`
- `getSimpleRichTextField(...)`
- `getLocales()`
- `getFallbackLocale()`
- `getDefaultLinkableCollections()`
- `getDefaultEvents()`
- `getDefaultEventOptions()`

It also lets you define shared defaults for:

- `defaultLinkableCollections`: the collections used by `getLinkField(...)` when `linkTo` is not provided
- `defaultEvents`: the event options used by CTA, navigation, and settings link fields

`defaultEvents` takes objects with:

- `id`: the stored value, for example `open_calculator`
- `label`: a plain label or a localized label object such as `{ en: 'Open calculator', nl: 'Open calculator' }`

Other packages use those helpers instead of hardcoding your app's:

- tenant filtering rules
- rich text field implementation
- locale list
- fallback locale
- Payload access entrypoint

## Sharing typed defaults across packages

If you also want TypeScript to know your shared linkable collections and event ids across packages, augment `PayloadUtilsRegistry` in your app:

```ts
import type { Config } from 'payload'

declare module '@wisemen/payload-core-utils' {
  interface PayloadUtilsRegistry {
    Payload: Config
    linkableCollection: 'pages' | 'articles' | 'services'
    navigationEvent: 'open_calculator' | 'open_contact_modal'
  }
}
```

That single augmentation is then picked up by packages like `@wisemen/payload-core-links`, so types such as `ClientLink`, `ClientNavigationLink`, and the related transformers narrow automatically.

## Why it matters

Without this package, shared CMS packages would need to know too much about the host app.

With it:

- `auth` can create or find users through your configured Payload instance
- `links` can reuse your default linkable collections and shared event options
- `settings` can apply tenant filters, generate the right rich text fields, and reuse the same link and event defaults as the rest of the CMS

## Shared defaults in other packages

Once configured in `payloadUtilsPlugin(...)`:

- `@wisemen/payload-core-links` uses `defaultLinkableCollections` for `getLinkField(...)`
- `@wisemen/payload-core-links` uses `defaultEvents` for CTA and navigation event fields
- `@wisemen/payload-core-settings` uses the same shared `defaultEvents` for footer event links

You only need to configure those defaults once.

## Notes

- `locales` must be non-empty.
- `fallbackLocale` must exist inside `locales`.
- If this package is not initialized before dependent packages run, they throw initialization errors.
