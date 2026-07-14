---
title: Installation
layout: doc
---

# Installation

`@wisemen/payload-core-links` gives you reusable Payload field builders for links, CTAs, and navigation structures.

## Install

```ts
import {
  getCtaField,
  getLinkField,
  getNavLinkField,
  getNavLinksField,
} from '@wisemen/payload-core-links'
```

## What it adds to collections

This package adds fields to whatever collection you place them in.

### `getLinkField(...)`

Adds a grouped link editor with:

- `type`: `reference` or `custom`
- `newTab`
- `reference`: relationship field for internal links
- `url`: text field for custom URLs

By default the relationship can point to:

- `pages`
- `articles`

If `payload-core-utils` is initialized with `defaultLinkableCollections`, those configured values are used automatically whenever `linkTo` is not passed.

### `getCtaField(...)`

Adds a CTA group with:

- `label`
- `ctaVariant`
- `ctaType`
- nested link config for link-based CTAs
- event selection for event-based CTAs

The event select uses the shared `defaultEvents` configured through `payloadUtilsPlugin(...)`.

### `getNavLinkField(...)`

Adds a single navigation item with:

- `label`
- `navType`: `link`, `event`, or `dropdown`
- nested link config
- dropdown child links when `navType === 'dropdown'`

All event-based navigation options also use the shared `defaultEvents` from `payload-core-utils`.

### `getNavLinksField(...)`

Adds an array of navigation rows. Each row contains one `navLink` object from `getNavLinkField(...)`.

## Basic usage

```ts
import type { CollectionConfig } from 'payload'
import {
  getCtaField,
  getLinkField,
  getNavLinksField,
} from '@wisemen/payload-core-links'

export const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    getLinkField({
      name: 'heroLink',
      disableLabel: true,
    }),
    getCtaField({
      name: 'heroCta',
      label: 'Hero CTA',
    }),
    getNavLinksField({
      name: 'headerLinks',
      label: 'Header links',
      isTranslatable: true,
    }),
  ],
}
```

## Front-end helpers

The package also exports transformers and zod schemas so frontend code does not have to consume raw Payload relationship data directly.

Useful exports:

- `LinkTransformer`
- `NavigationLinkTransformer`
- `clientLinkSchema`
- `clientNavigationLinkSchema`

If your app augments `PayloadUtilsRegistry` in `@wisemen/payload-core-utils`, these exports also get project-specific types for:

- `relationTo` on internal links
- navigation/footer event ids

You can also pass explicit schema/transformer overrides when a field uses collections or events outside the shared defaults.

## Notes

- `getLinkField(...)` returns a `group` field.
- `getNavLinksField(...)` returns an `array` field.
- If `payload-core-utils` is not configured with `defaultEvents`, event option arrays stay empty by default.
- You can still override linkable collections explicitly with `linkTo` when a field should not use the shared defaults.
