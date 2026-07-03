---
title: Adapters
layout: doc
---

# Adapters

`@wisemen/payload-core-translate` ships with two built-in adapters:

- [Google Translate](/cms/packages/translate/pages/getting-started/google-translate)
- [DeepL](/cms/packages/translate/pages/getting-started/deepl)

Each adapter definition provides:

- a `key` used when storing adapter config
- a `label` shown in the Payload admin UI
- a `fields` array with the settings inputs to render
- a `create(options)` factory that returns the runtime translator
- an optional `defaultOptions` object

If you want to build your own adapter, see [Custom adapters](/cms/packages/translate/pages/getting-started/custom-adapters).
