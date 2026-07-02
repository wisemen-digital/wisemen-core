---
title: Custom adapters
layout: doc
---

# Custom adapters

You can add your own translation adapter by implementing the `TranslationAdapterDefinition` contract.

## Shape

An adapter definition can include:

- `key`: the stored identifier for the adapter config
- `label`: the tab label in the Payload translation settings UI
- `fields`: the Payload fields that editors fill in
- `defaultOptions`: fallback values merged with stored settings
- `create(options)`: returns a `TranslationAdapter`

The `create()` function receives the merged adapter options object and must return an object with a `translate()` method.

## Example

```ts
import type { TranslationAdapterDefinition } from '@wisemen/payload-core-translate'
import { payloadTranslatePlugin } from '@wisemen/payload-core-translate'

interface MyAdapterOptions {
  apiKey?: string
  apiURL?: string
}

const myAdapterDefinition: TranslationAdapterDefinition<MyAdapterOptions> = {
  key: 'my-provider',
  label: 'My Provider',
  defaultOptions: {
    apiURL: 'https://example.com/translate',
  },
  fields: [
    {
      name: 'apiKey',
      label: 'API key',
      type: 'text',
    },
    {
      name: 'apiURL',
      label: 'API URL',
      type: 'text',
    },
  ],
  create(options) {
    return {
      async translate({ text }) {
        return translateWithMyProvider(text, options)
      },
    }
  },
}

payloadTranslatePlugin({
  adapters: [
    myAdapterDefinition,
  ],
})
```

## How settings are resolved

When translation settings are stored in Payload, the runtime:

- looks up the adapter config by `key`
- merges stored values with `defaultOptions`
- ignores `null`, `undefined`, and empty string overrides
- passes the merged object into `create(options)`

If no translation settings document is configured, the plugin instantiates each adapter with its `defaultOptions`.

## Tips

- Keep your adapter `key` stable once it ships, because it is used as the settings tab name and stored data key.
- Use `defaultOptions` for safe API endpoints or provider defaults.
- Expose only the fields editors should actually edit in Payload.
