---
"@wisemen/vue-core-design-system": patch
---

Fix dropdown/context menus not keeping an item highlighted while navigating via keyboard. Items loaded in asynchronously, or a list filtered down to zero results and then cleared, could end up with nothing highlighted. The first item is now kept highlighted for as long as the menu stays open and the user is driving it via keyboard, including once a search/filter kicks in on a menu that was opened with the mouse.
