---
layout: home

hero:
  name: "i18n-factory"
  text: "Type-safe i18n factory"
  tagline: Build flexible, type-safe internationalization with strict key validation
  actions:
    - theme: brand
      text: Get Started
      link: /packages/i18n-factory/pages/getting-started/installation
    - theme: alt
      text: View on GitHub
      link: https://github.com/wisemen-digital/wisemen-core/tree/main/packages/web/i18n-factory

features:
  - title: Type-Safe Keys
    details: Prevent typos and runtime errors with TypeScript's full type checking for translation keys
  - title: Flexible Overrides
    details: Partial overrides for default locales and full support for extending with new locales
  - title: Strict Validation
    details: Only allow keys that exist in your default locales, preventing accidental keys
  - title: Frozen Objects
    details: Returns immutable translation objects to prevent accidental mutations
