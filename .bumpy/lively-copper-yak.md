---
"@wisemen/vue-core-design-system": minor
---

Add sticky header, footer, body and tabs components for `DashboardPageDetailPane`

New components:
- `UIDashboardPageDetailPaneHeader` — sticky header built on `UIBaseHeader`, separator fades when scrolled to top, auto-hides separator when tabs are present
- `UIDashboardPageDetailPaneFooter` — sticky footer with a default slot, separator fades when scrolled to bottom
- `UIDashboardPageDetailPaneBody` — scrollable body, connects scroll tracking to header/footer separators
- `UIDashboardPageDetailPaneTabs` — compound tabs root (`underline` variant, full-width, with padding by default)
- `UIDashboardPageDetailPaneTabsList` — sticky tabs list bar
- `UIDashboardPageDetailPaneTabsContent` — scrollable tab content panel, connects scroll tracking per active tab
