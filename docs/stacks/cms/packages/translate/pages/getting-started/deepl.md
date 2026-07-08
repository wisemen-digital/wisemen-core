---
title: DeepL
layout: doc
---

# DeepL

The DeepL adapter definition is exported as `deeplTranslateAdapterDefinition`.

It accepts these options:

- `apiKey`
- `apiURL`

```ts
import {
  deeplTranslateAdapterDefinition,
  payloadTranslatePlugin,
} from '@wisemen/payload-core-translate'

payloadTranslatePlugin({
  adapters: [
    deeplTranslateAdapterDefinition,
  ],
})
```

## Behavior

- Empty text is returned unchanged.
- Locale codes are normalized before being sent to DeepL.
- The adapter posts the source text as a single-item translation batch.

## Fields

The adapter exposes these Payload settings fields:

- `apiKey`
- `apiURL`

Those field names match the options passed into `createDeepLTranslateAdapter()`.

## Notes

The default endpoint is:

- `https://api.deepl.com/v2/translate`

Set `apiURL` if you need to point at a different DeepL endpoint.
