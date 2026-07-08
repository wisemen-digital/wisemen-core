---
name: getting-started
description: Use when writing tests for NestJS api packages with custom expect matchers, domain events, or transactional TypeORM use cases.
---

# @wisemen/nestjs-tests - Getting Started

```ts
import { before } from 'node:test'
import { HttpStatus } from '@nestjs/common'
import { expect } from 'expect'
import { createStubInstance } from 'sinon'
import { DomainEventEmitter } from '@wisemen/nestjs-domain-events'

expect(response).toHaveStatus(HttpStatus.CREATED)
expect(response.body).toStrictEqual(expect.objectContaining({
  uuid: expect.uuid(),
  createdAt: expect.ISO8601(),
}))

await expect(command).toHaveValidationErrors()

const eventEmitter = createStubInstance(DomainEventEmitter)
const useCase = new CreateOrderUseCase(stubDataSource(), repository, eventEmitter)
const result = await useCase.execute(command)

expect(eventEmitter).toHaveEmitted(new OrderCreatedEvent(result.uuid))
```
