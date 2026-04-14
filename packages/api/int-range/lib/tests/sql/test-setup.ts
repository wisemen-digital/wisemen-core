import { ColumnType, EntityManager, QueryRunner } from 'typeorm'
import { ClassConstructor } from 'class-transformer'
import { dataSource } from './datasource.js'

export class IntegrationTestSetup {
  private queryRunner: QueryRunner | undefined
  private originalManager: EntityManager | undefined

  async setup () {
    if (!dataSource.isInitialized) {
      dataSource.driver.supportedDataTypes.push(
        'int8range' as ColumnType,
        'int8multirange' as ColumnType
      )
      await dataSource.initialize()
    }

    await dataSource.query('SELECT pg_advisory_lock(12345)')

    try {
      await dataSource.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1
            FROM pg_type t
            JOIN pg_namespace n ON n.oid = t.typnamespace
            WHERE t.typname = 'int8range'
              AND n.nspname = 'public'
          ) THEN
            CREATE TYPE int8range AS RANGE (
              subtype = int8,
              multirange_type_name = int8multirange
            );
          END IF;
        END $$;
     `)
      await dataSource.synchronize(true)
    } finally {
      await dataSource.query('SELECT pg_advisory_unlock(12345)')
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

  async clear (target: ClassConstructor<unknown>) {
    await this.queryRunner?.manager.clear(target)
  }

  async teardown () {
    if (this.queryRunner?.isTransactionActive === true) {
      await this.queryRunner.rollbackTransaction()
    }

    // Restore original manager
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
