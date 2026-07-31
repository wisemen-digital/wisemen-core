---
"@wisemen/vue-core-design-system": patch
---

Fixed the date picker and date range picker opening on a fully-disabled month when today's date (or the current value) falls before minDate or after maxDate; the calendar now opens clamped to the nearest selectable date.
