import { EntityManager, QueryRunner } from 'typeorm'
import { dataSource } from './sql/datasource.js'

export class IntegrationTestSetup {
  private queryRunner: QueryRunner | undefined
  private originalManager: EntityManager | undefined

  async setup (): Promise<void> {
    if (!dataSource.isInitialized) {
      await dataSource.initialize()
    }

    await dataSource.query("SELECT pg_advisory_lock(hashtext('csv'))")

    try {
      await dataSource.query('CREATE SCHEMA IF NOT EXISTS "csv"')
      await dataSource.synchronize(true)
    } finally {
      await dataSource.query("SELECT pg_advisory_unlock(hashtext('csv'))")
    }

    this.queryRunner = dataSource.createQueryRunner()
    await this.queryRunner.connect()
    await this.queryRunner.startTransaction()
    this.originalManager = dataSource.manager

    Object.defineProperty(dataSource, 'manager', {
      configurable: true,
      value: this.queryRunner.manager
    })
  }

  async teardown (): Promise<void> {
    if (this.queryRunner?.isTransactionActive === true) {
      await this.queryRunner.rollbackTransaction()
    }

    if (this.originalManager) {
      Object.defineProperty(dataSource, 'manager', {
        configurable: true,
        value: this.originalManager
      })
    }

    if (this.queryRunner) {
      await this.queryRunner.release()
    }

    if (dataSource.isInitialized) {
      await dataSource.destroy()
    }
  }
}
