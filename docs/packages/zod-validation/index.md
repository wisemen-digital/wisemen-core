---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Zod Validation"
  tagline: "Ready-to-use Zod validators with built-in i18n support."
  actions:
    - theme: brand
      text: Get started
      link: /packages/zod-validation/pages/getting-started/installation
    - theme: alt
      text: View translation guide
      link: /packages/zod-validation/pages/usage/translations

features:
  - title: Phone Number Validation
    details: Validate international phone numbers with libphonenumber-js through a reusable Zod schema.
  - title: Vue I18n Integration
    details: Connect your app i18n instance once and reuse localized error messages in your schema validations.
  - title: Translation Factory
    details: Extend or override package translations with the i18n factory pattern.
---