---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Filters"
  text: "Filters for list views"
  tagline: Type-safe, actions-integrated filters with built-in UI components — zero boilerplate filter state management.
  actions:
    - theme: brand
      text: Getting started
      link: /web/packages/filters/pages/getting-started/installation
    - theme: alt
      text: Filter types
      link: /web/packages/filters/pages/usage/filter-types

features:
  - title: Actions-integrated
    details: Each filter registers as an action, so filters appear in the command menu and respond to keyboard shortcuts out of the box.
    icon: ⚡
  - title: Type-safe values
    details: FilterValues<TFilters> infers a precise type for every filter key — no manual type annotations needed.
    icon: 🔒
  - title: Five filter types
    details: Multi-select, multi-autocomplete (with pagination), boolean, number, and date range — covering the most common filtering patterns.
    icon: 🎛️
  - title: Built-in UI
    details: UIFiltersDropdownMenu and UIFiltersActive handle the picker, badges, and dialogs. Drop them in and they wire up via context.
    icon: 🧩
  - title: I18n ready
    details: Ships with English and Dutch translations. Merge the bundled locales into your vue-i18n instance to get started.
    icon: 🌍
---
