# @wisemen/nestjs-tests

Testing helpers for NestJS API packages, with custom `expect` matchers and a
stubbed TypeORM `DataSource` for transaction-based unit tests.

## Installation

```bash
pnpm add -D @wisemen/nestjs-tests
```

### Peer dependencies

```bash
pnpm add -D @wisemen/nestjs-domain-events typeorm
```

## Usage

### Register the matchers once

```ts
import { expect } from 'expect'
import {
  ISO8601,
  isEnumValue,
  toHaveEmitted,
  toHaveErrorCode,
  toHaveStatus,
  toHaveValidationErrors,
  uuid,
} from '@wisemen/nestjs-tests'

expect.extend({
  ISO8601,
  isEnumValue,
  toHaveEmitted,
  toHaveErrorCode,
  toHaveStatus,
  toHaveValidationErrors,
  uuid,
})
```

### Assert HTTP responses and DTO validation

```ts
import { HttpStatus } from '@nestjs/common'

expect(response).toHaveStatus(HttpStatus.CREATED)
expect(response).toHaveErrorCode('validation_error')

expect(response.body).toStrictEqual(expect.objectContaining({
  uuid: expect.uuid(),
  createdAt: expect.ISO8601(),
}))

await expect(command).toHaveValidationErrors()
expect(role).isEnumValue(UserRole)
```

### Stub transactional use cases

`stubDataSource()` creates a Sinon stub for `DataSource` and executes
`transaction(...)` callbacks with a stubbed `EntityManager`.

```ts
import { createStubInstance } from 'sinon'
import { DomainEventEmitter } from '@wisemen/nestjs-domain-events'
import { stubDataSource } from '@wisemen/nestjs-tests'

const eventEmitter = createStubInstance(DomainEventEmitter)
const useCase = new CreateOrderUseCase(
  stubDataSource(),
  createStubInstance(OrderRepository),
  eventEmitter,
)

const response = await useCase.execute(command)

expect(eventEmitter).toHaveEmitted(new OrderCreatedEvent(response.uuid))
```

## License

GPL
