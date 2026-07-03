import { createStubInstance } from 'sinon'
import { DataSource, EntityManager } from 'typeorm'

export function stubDataSource (): DataSource {
  const dataSource = createStubInstance(DataSource)

  dataSource.transaction.callsFake(async (arg1, arg2) => {
    const runInTransaction = typeof arg1 === 'function' ? arg1 : arg2

    return runInTransaction(createStubInstance(EntityManager))
  })

  return dataSource
}
