---
"@wisemen/vue-core-design-system": minor
---

Date formatting now uses configContext.dateLocale. The locale is resolved in order: configContext.dateLocale → navigator.language.
