# Payload form builder

`@repo/payload-form-builder` gives editors a **Forms** collection and a separate **Form submissions** inbox. Forms support drafts; each answer is stored with the field label that existed at submission time, so Payload presents submissions as a readable question-and-answer list instead of opaque JSON.

## Install in Payload

```ts
import { formBuilderPlugin } from '@repo/payload-form-builder'

export default buildConfig({
  plugins: [
    formBuilderPlugin({
      async onSubmission({ form, submission, values }) {
        // Prefer queueing mail/CRM work rather than doing network I/O inline.
        await queueSubmissionNotification({ form, submission, values })
      },
    }),
  ],
})
```

## Submit from your API layer

Expose the package service through the project's oRPC route, REST endpoint, or server action:

```ts
import { submitForm } from '@repo/payload-form-builder'

await submitForm(payload, {
  form: 'contact-us', // form id or slug
  data: { firstName: 'Ada', email: 'ada@example.com', message: 'Hello' },
})
```

The service validates field names, required values, number/email values, and select/radio options. `onSubmission` is a real Payload `afterChange` hook: it runs for every newly-created submission, including records created outside `submitForm`. It intentionally does not expose a public endpoint itself: rate limiting, CAPTCHA, tenant resolution, and authentication belong to the consuming application.

## Starter contact form seed

The package exports `contactFormSeed` and `getContactFormSeedRef`. Add the seed to the consuming app's definitions before any page seed that uses the reference. The template registers it and places the form in its seeded **All blocks test** page.
