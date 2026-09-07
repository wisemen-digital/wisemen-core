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
- Queued strings for the same source and target locale are combined into a single request,
  up to a conservative 127 KiB JSON body limit.
- Batch requests are sent one at a time, with a 500ms minimum interval between calls. When
  DeepL rate-limits a request, the interval is increased and retries use exponential
  backoff; a `Retry-After` response header is honored when present.
- The throttle is shared by adapters using the same DeepL endpoint and API key, including
  consecutive translation runs for different locales.

## Fields

The adapter exposes these Payload settings fields:

- `apiKey`
- `apiURL`

Those field names match the options passed into `createDeepLTranslateAdapter()`.

## Notes

The default endpoint is:

- `https://api.deepl.com/v2/translate`

Set `apiURL` if you need to point at a different DeepL endpoint.
