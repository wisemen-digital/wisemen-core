# Async results

Use `MockResult` when a mocked API method returns a Wisemen `ApiResult` or paginated result.

```ts
import { MockResult } from '@wisemen/vue-core-test-utils'

const success = MockResult.ok({ id: 'contact-1' })
const page = MockResult.toOffsetPagination([{ id: 'contact-1' }])
const emptyMutation = MockResult.toVoid()
```

`MockResult.ok` returns a successful `ApiResult`, `MockResult.toOffsetPagination` supplies the standard `data` and `meta` shape, and `MockResult.toVoid()` returns a successful `ApiResult<void>`.

The template uses `MockResult.ok` for the contact detail query:

```ts
getContact: () => MockResult.ok({
  uuid: contactUuid,
  isActive: true,
  email: 'ada@example.com',
  file: null,
  firstName: 'Ada',
  lastName: 'Lovelace',
  phoneNumber: null,
})
```
