---
"@wisemen/vue-core-design-system": minor
---

UIDropdownMenu, UIContextMenu: Content can now grow past its min-width to fit larger items. While open,
it remembers the widest size it has rendered at so it never shrinks back
down and shifts the layout; this resets each time the menu is reopened. This requires `is-adaptive-content-width: true`
