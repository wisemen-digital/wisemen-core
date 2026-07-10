---
title: Installation
layout: doc
---

# Installation

`@wisemen/payload-core-settings` provides shared settings collections and typed query helpers for site-wide content.

## Install

```ts
import { settingsPlugin } from '@wisemen/payload-core-settings'
```

## Basic setup

```ts
import { buildConfig } from 'payload'
import { settingsPlugin } from '@wisemen/payload-core-settings'

export default buildConfig({
  plugins: [
    settingsPlugin({
      access: {
        read: () => true,
        update: ({ req }) => Boolean(req.user),
      },
    }),
  ],
})
```

## What it adds to Payload

The plugin appends two collections:

- `settings`
- `settingsLegalPages`

### `settings`

This collection adds tabbed settings for:

- `general`
  - `adminEmail`
- `contact`
  - `email`
  - `phone`
  - `whatsappLink`
- `home`
  - `homePage` using `getLinkField(...)`
- `header`
  - `links` using `getNavLinksField(...)`
  - `subheaderLinks` using `getNavLinksField(...)`
- `footer`
  - `sections` with titles, optional links, and nested footer links
- `socials`
  - `facebook`
  - `instagram`
  - `linkedin`
  - `youtube`
  - `pinterest`
  - `tiktok`

### `settingsLegalPages`

This collection adds tabbed rich text content for:

- `termsAndConditions`
- `cookiePolicy`
- `privacyPolicy`

## Shared defaults from utils

This package reuses the shared defaults configured in `@wisemen/payload-core-utils`.

That means:

- homepage and footer link fields inherit `defaultLinkableCollections` through `getLinkField(...)`
- header and subheader navigation inherit shared event options through `@wisemen/payload-core-links`
- footer event links use the same shared `defaultEvents`

Configure those defaults once in `payloadUtilsPlugin(...)` and the settings package picks them up automatically.

## Collection dependencies

`settingsPlugin(...)` accepts:

- `access`: applied to both collections
- `hooks`: optional per-collection hooks for `settings` and `settingsLegalPages`

That lets you keep the shared schema while still attaching app-specific access rules or lifecycle behavior.

## Query helpers

The package also exports:

- `getSettingsContact`
- `getSettingsFooter`
- `getSettingsGeneral`
- `getSettingsHeader`
- `getSettingsHomepage`
- `getSettingsSocials`

These read the underlying collections and normalize link and navigation data for frontend consumption.

## Notes

- This package depends on `@wisemen/payload-core-links` for shared link and navigation field shapes.
- It also depends on `@wisemen/payload-core-utils` for tenant queries, locale helpers, rich text field creation, and shared link/event defaults.
