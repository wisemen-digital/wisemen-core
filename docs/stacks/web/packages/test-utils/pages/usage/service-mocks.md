# Service mocks

`ServiceMock.mock()` creates a typed module mock and wraps each configured method in a Vitest mock function.

```ts
import { ServiceMock } from '@wisemen/vue-core-test-utils'
import type { ContactService } from '@/modules/contact/api/contact.service'

const contactService = ServiceMock.mock<typeof ContactService>({
  methods: {
    getContacts: () => ServiceMock.toPaginatedResult([]),
    createContact: () => ServiceMock.toVoid(),
  },
  serviceName: 'ContactService',
  path: '@/modules/contact/api/contact.service',
})

expect(contactService.getContacts).toHaveBeenCalledOnce()
```

The service export remains stable across scenarios. Calling `ServiceMock.mock()` again for the same path updates and resets the configured method implementations.
