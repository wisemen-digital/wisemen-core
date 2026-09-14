import 'reflect-metadata'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { SetMetadata, type DynamicModule, type FactoryProvider } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { DataSource } from 'typeorm'
import { JobsApiModule } from './jobs-api.module.js'

describe('JobsApiModule', () => {
  it('registers queue-aware controllers and forwards handler decorators', async () => {
    const moduleDefinition = JobsApiModule.forRootAsync({
      queueNames: ['system', 'notifications'],
      inject: [DataSource],
      useFactory: (dataSource: DataSource) => ({ dataSource }),
      controllers: {
        index: {
          handlerDecorators: [SetMetadata('test-handler-metadata', true)]
        }
      }
    })

    assert.equal(moduleDefinition.imports?.length, 3)

    const optionsModule = moduleDefinition.imports?.[0] as DynamicModule
    const optionsProvider = optionsModule.providers?.[0] as FactoryProvider
    const dataSource = {} as DataSource
    const resolvedOptions = await (optionsProvider.useFactory as (dataSource: DataSource) => Promise<{
      dataSource: DataSource
      queueNames: string[]
    }>)(dataSource)
    const indexModule = moduleDefinition.imports?.[1] as DynamicModule
    const controller = indexModule.controllers?.[0] as typeof Object
    const handler = Object.getOwnPropertyDescriptor(controller.prototype, 'getJobs')?.value as object
    const [query] = Reflect.getMetadata('design:paramtypes', controller.prototype, 'getJobs') as [new () => object]

    assert.equal(Reflect.getMetadata('test-handler-metadata', handler), true)
    assert.strictEqual(resolvedOptions.dataSource, dataSource)
    assert.deepEqual(resolvedOptions.queueNames, ['system', 'notifications'])

    const validQuery = plainToInstance(query, { filter: { queueNames: ['system'] } })
    const invalidQuery = plainToInstance(query, { filter: { queueNames: ['unknown'] } })

    assert.equal((await validate(validQuery)).length, 0)
    assert.notEqual((await validate(invalidQuery)).length, 0)
  })

  it('allows disabling individual controllers', () => {
    const moduleDefinition = JobsApiModule.forRootAsync({
      queueNames: ['system'],
      useFactory: () => ({ dataSource: {} as DataSource }),
      controllers: {
        detail: false
      }
    })

    assert.equal(moduleDefinition.imports?.length, 2)
  })
})
