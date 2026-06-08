---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Custom Views"
  text: "Saved views for list and table pages"
  tagline: Let users save, name, and switch between filtered table configurations — with keyboard shortcuts, URL-synced state, and pluggable adapters.
  actions:
    - theme: brand
      text: Getting started
      link: /packages/custom-views/pages/getting-started/installation
    - theme: alt
      text: Adapters
      link: /packages/custom-views/pages/usage/adapters

features:
  - title: URL-synced active view
    details: The active view ID is stored in the URL query string (?viewId=...) via @vueuse/router, so deep links always land on the right view.
    icon: 🔗
  - title: Keyboard shortcuts
    details: Press 1–9 (with or without shift for azerty/qwerty) to instantly switch between the first nine views.
    icon: ⌨️
  - title: Pluggable state adapters
    details: Connect filters, search, and table column visibility to views with built-in adapters, or write your own with createCustomViewStateAdapter.
    icon: 🔌
  - title: Persistent storage
    details: Views are saved to localStorage via createCustomViewLocalStorageAdapter. Swap in any storage backend by implementing the CustomViewStorageAdapter interface.
    icon: 💾
  - title: Actions integration
    details: Save and create actions are registered in the actions context so they appear in the command menu out of the box.
    icon: ⚡
  - title: Color and icon customization
    details: Users can label each view with a color and icon chosen from built-in pickers. CustomViewColor and CustomViewIcon are as const objects with string literal values — use dot notation like CustomViewColor.DEFAULT or CustomViewIcon.STAR.
    icon: 🎨
---
