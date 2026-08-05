---
title: Google Translate
layout: doc
---

# Google Translate

The Google adapter definition is exported as `googleTranslateAdapterDefinition`.

It accepts these options:

- `apiKey`
- `apiURL`
- `fallbackApiURL`

```ts
import {
  googleTranslateAdapterDefinition,
  payloadTranslatePlugin,
} from '@wisemen/payload-core-translate'

payloadTranslatePlugin({
  adapters: [
    googleTranslateAdapterDefinition,
  ],
})
```

## Behavior

- If `apiKey` is set, the adapter uses the Google Cloud Translate v2 API.
- If `apiKey` is missing, it falls back to the public translate endpoint.
- Empty text is returned unchanged.
- Locale codes are normalized to the form Google expects before requests are sent.

## Fields

The adapter exposes these Payload settings fields:

- `apiKey`
- `apiURL`
- `fallbackApiURL`

Those field names match the options passed into `createGoogleTranslateAdapter()`.

## Notes

The default endpoints are:

- `https://translation.googleapis.com/language/translate/v2`
- `https://translate.googleapis.com/translate_a/single`

You can override both if you need to target a proxy or a self-hosted translation layer.
