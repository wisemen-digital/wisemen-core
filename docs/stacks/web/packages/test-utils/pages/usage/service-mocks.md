# Service mocks

`ServiceMock.mock()` creates a typed module mock and wraps each configured method in a Vitest mock function.

```ts
import { ServiceMock } from '@wisemen/vue-core-test-utils'
import type { ContactService } from '@/modules/contact/api/contact.service'

const contactService = ServiceMock.mock<typeof ContactService>({
  methods: {
    createContact: () => ServiceMock.toVoid(),
  },
  serviceName: 'ContactService',
  path: '@/modules/contact/api/contact.service',
})

expect(contactService.createContact).toHaveBeenCalledOnce()
```

The service export remains stable across scenarios. Calling `ServiceMock.mock()` again for the same path updates and resets the configured method implementations.

This is the same pattern used by the template’s create-dialog test:

```ts
const mockContactService = ServiceMock.mock<typeof ContactService>({
  methods: {
    createContact: () => ServiceMock.toVoid(),
  },
  serviceName: 'ContactService',
  path: '@/modules/contact/api/contact.service',
})

expect(mockContactService.createContact).not.toHaveBeenCalled()
```

For an update service with multiple methods, the template uses a successful detail result and a void mutation result:

```ts
const contactUuid = 'a0f2f9bb-5a80-4ddb-a315-dad9900f55aa' as ContactUuid

const mockContactService = ServiceMock.mock<typeof ContactService>({
  methods: {
    getContact: () => mockAsyncResult({
      uuid: contactUuid,
      isActive: true,
      email: 'ada@example.com',
      file: null,
      firstName: 'Ada',
      lastName: 'Lovelace',
      phoneNumber: null,
    }),
    updateContact: () => ServiceMock.toVoid(),
  },
  serviceName: 'ContactService',
  path: '@/modules/contact/api/contact.service',
})
```
