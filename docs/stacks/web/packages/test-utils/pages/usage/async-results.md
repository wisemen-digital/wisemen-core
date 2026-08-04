# Async results

Use the result helpers when a mocked API method returns a Wisemen `ApiResult` or paginated result.

```ts
import {
  mockAsyncPaginatedResult,
  mockAsyncResult,
  ServiceMock,
} from '@wisemen/vue-core-test-utils'

const success = mockAsyncResult({ id: 'contact-1' })
const page = mockAsyncPaginatedResult([{ id: 'contact-1' }])
const emptyMutation = ServiceMock.toVoid()
```

`mockAsyncResult` returns a successful `ApiResult`, `mockAsyncPaginatedResult` supplies the standard `data` and `meta` shape, and `ServiceMock.toVoid()` returns a successful `ApiResult<void>`.
