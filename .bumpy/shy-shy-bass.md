---
"@wisemen/vue-core-custom-views": minor
"@wisemen/vue-core-filters": patch
---

Unsaved view state is now persisted in the URL (`?view-state`). Refreshing the page or navigating away and back restores any unsaved adapter changes (filters, search, columns, etc.). State is cleared automatically when switching views, saving, or deleting.

Added a "Discard changes" action that resets all adapter state back to the last saved view. Only visible when the view is dirty.

