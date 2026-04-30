# Phone Number Schema

`phoneNumberSchema` validates a string as an international phone number using `libphonenumber-js`.

```typescript
import { phoneNumberSchema } from '@wisemen/vue-core-zod-validation'

phoneNumberSchema.parse('+32475123456')
```

## Behavior

- Accepts valid phone numbers for supported regions
- Rejects malformed or impossible numbers
- Returns a localized error message via your configured i18n instance

## Example with object schema

```typescript
import { z } from 'zod'
import { phoneNumberSchema } from '@wisemen/vue-core-zod-validation'

const contactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: phoneNumberSchema,
})
```