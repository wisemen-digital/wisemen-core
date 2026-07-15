# @wisemen/web-e2e

Playwright end-to-end testing toolkit for Wisemen web apps. It provides a ready-to-extend test fixture, semantic page objects, MSW mocking helpers, fluent DTO/error builders, and a Playwright config helper — so every app writes E2E tests the same way instead of re-inventing utilities.

## What's included

- **Fixture factory** — `createTest()` wires up MSW (`playwright-msw`), a role-based permission context, WebSocket mocking, Istanbul coverage collection, accessibility scanning, and console-error monitoring.
- **Page objects** — `FormTestUtil`, `TableTestUtil`, `DialogTestUtil`, `TestUtil`, `PaginationTestUtil`, `ToastTestUtil`, `StateTestUtil`, `BreadcrumbTestUtil`, `TabTestUtil`, `SearchFilterUtil`, `BulkActionsUtil`, `MultiStepFormUtil`, `MapTestUtil`.
- **Mocking** — `CrudHandlerFactory` for standard REST endpoints and error-response builders (`BadRequestBuilder`, `UnauthorizedBuilder`, `ForbiddenBuilder`, `NotFoundBuilder`, `ConflictBuilder`, `ServerErrorBuilder`) that emit the JSON:API error shape used across Wisemen APIs.
- **Builders** — `BuilderBase` for fluent, defaulted test-data builders.
- **Auth** — `createAuthSetup()` for OIDC storage-state setup.
- **Config** — `defineConfig()` (via `@wisemen/web-e2e/config`) wrapping Playwright's config with sensible defaults.

## Installation

```bash
pnpm add -D @wisemen/web-e2e @playwright/test msw playwright-msw @axe-core/playwright
```

`@playwright/test`, `msw`, `playwright-msw`, and `@axe-core/playwright` are peer dependencies — install them in the consuming app.

## Quick start

### 1. `playwright.config.ts`

```ts
import { defineConfig } from '@wisemen/web-e2e/config'

export default defineConfig({
  port: 4000,
  testMatch: 'src/modules/**/tests/*.e2e.spec.ts',
  auth: {
    enabled: true,
    storageStatePath: 'tests/.auth/user.json',
  },
  testing: {
    accessibility: true,
    consoleMonitoring: true,
  },
  retries: process.env.CI != null ? 2 : 0,
})
```

### 2. `tests/fixture/base.fixture.ts`

Create a project-local fixture that extends the package with your app's handlers and permission type:

```ts
import { createTest } from '@wisemen/web-e2e'

import type { PermissionType } from '@/composables/permission-guard/permissionGuard.composable'
import { authHandlers } from '@/mocks/handlers/auth.mock'

export const test = createTest<PermissionType>({
  defaultPermissions: ['resource.read'],
  handlers: [...authHandlers],
  websocketUrlPattern: 'wss://api.base.url/websockets*',
})

export { expect } from '@wisemen/web-e2e'
```

### 3. A test

```ts
import { expect, test } from '@tests/fixture/base.fixture'
import { FormTestUtil, TableTestUtil, TestUtil } from '@wisemen/web-e2e'

import { UserDtoBuilder } from '@/modules/user/models/userDto.builder'
import { MockHandlerFactory } from '@tests/utils/mockHandler.factory'

test.describe('User create', () => {
  test.use({ userPermissions: ['user.read', 'user.create'] })

  test('creates a user', async ({ page, worker }) => {
    const user = new UserDtoBuilder().withName('Jane').build()

    await worker.use(
      MockHandlerFactory.user.getIndex([]),
      MockHandlerFactory.user.create(user),
    )

    await page.goto('/admin/users')
    await page.getByRole('button', { name: 'Create' }).click()

    const dialog = new TestUtil(page).getActiveDialog()
    const form = new FormTestUtil(page, dialog.locator('form'))

    await form.getTextFieldByLabel('Name').fill('Jane')
    await form.submit()

    await expect(page.getByRole('alert')).toContainText('created')
  })
})
```

## Mocking

### `CrudHandlerFactory`

```ts
import { CrudHandlerFactory } from '@wisemen/web-e2e'

const users = new CrudHandlerFactory<UserDto>({ endpoint: 'users' })

await worker.use(
  users.getIndex([user1, user2]), // GET    */api/v1/users (paginated)
  users.getDetail(user1),         // GET    */api/v1/users/:uuid
  users.create({ uuid }),         // POST   */api/v1/users        -> 201
  users.update(updatedUser),      // PATCH  */api/v1/users/:uuid
  users.delete(),                 // DELETE */api/v1/users/*       -> 204
)
```

### Error responses

Builders emit `{ errors: [{ code, detail, status, source?: { pointer } }] }`:

```ts
import { BadRequestBuilder, ForbiddenBuilder } from '@wisemen/web-e2e'
import { http } from 'msw'

await worker.use(
  http.post('*/api/v1/users', () =>
    new BadRequestBuilder()
      .withFieldError('email', 'Email already exists')
      .build()),
)

await worker.use(
  http.get('*/api/v1/users', () =>
    new ForbiddenBuilder().withMessage('You do not have permission').build()),
)
```

## Test data — `BuilderBase`

```ts
import { BuilderBase } from '@wisemen/web-e2e'

export class UserDtoBuilder extends BuilderBase<UserDto> {
  constructor(initial?: Partial<UserDto>) {
    super({
      uuid: BuilderBase.randomUuid(),
      name: 'John Doe',
      email: 'john@example.com',
      ...initial,
    })
  }

  withName(name: string): this {
    this.value.name = name

    return this
  }
}
```

## Locator strategy

Page objects use semantic, role-based locators (`getByRole`, `getByLabel`). Write accessible markup and prefer role/label/text selectors over CSS, `data-testid`, or XPath.

## Building

```bash
pnpm build       # bundle with tsdown (esm) -> dist/
pnpm type-check
pnpm lint
pnpm test
```
