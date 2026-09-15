import { createHash } from 'node:crypto'
import {
  DataSource,
  type DataSourceOptions,
  type EntityManager,
  type EntityTarget,
  type NamingStrategyInterface,
  type QueryRunner
} from 'typeorm'

export interface PostgresTestSetupOptions {
  dataSourceOptions: DataSourceOptions
  entities: EntityTarget<unknown>[]
  packageName: string
  workerId?: string
  namingStrategy?: NamingStrategyInterface
}

/** A PostgreSQL datasource isolated in a package/worker-specific schema. */
export class PostgresTestSetup {
  public readonly dataSource: DataSource
  public readonly schema: string
  private readonly controlDataSource: DataSource
  private runner: QueryRunner | null = null

  private constructor (options: PostgresTestSetupOptions) {
    this.schema = safeSchemaName(options.packageName, options.workerId)
    this.controlDataSource = new DataSource(options.dataSourceOptions)
    const existingExtra = options.dataSourceOptions.extra as Record<string, unknown> | undefined
    const existingConnectionOptions = typeof existingExtra?.options === 'string'
      ? `${existingExtra.options} `
      : ''

    this.dataSource = new DataSource({
      ...options.dataSourceOptions,
      type: 'postgres',
      schema: this.schema,
      entities: options.entities,
      namingStrategy: options.namingStrategy,
      extra: {
        ...existingExtra,
        options: `${existingConnectionOptions}-c search_path=${this.schema},public`
      },
      synchronize: false
    } as DataSourceOptions)
  }

  public static async create (options: PostgresTestSetupOptions): Promise<PostgresTestSetup> {
    const setup = new PostgresTestSetup(options)

    try {
      await setup.initialize()
    } catch (error) {
      try {
        await setup.teardown()
      } catch {
        throw new Error(
          `Postgres test setup failed. Cleanup manually with: DROP SCHEMA IF EXISTS "${setup.schema}" CASCADE`,
          { cause: error }
        )
      }

      throw error
    }

    return setup
  }

  public get manager (): EntityManager {
    return this.runner?.manager ?? this.dataSource.manager
  }

  public async beginRollbackTest (): Promise<EntityManager> {
    if (this.runner !== null) throw new Error('A rollback test transaction is already active')

    this.runner = this.dataSource.createQueryRunner()
    await this.runner.connect()
    await this.runner.startTransaction()

    return this.runner.manager
  }

  public async rollbackTest (): Promise<void> {
    if (this.runner?.isTransactionActive === true) await this.runner.rollbackTransaction()
    await this.runner?.release()
    this.runner = null
  }

  public async teardown (): Promise<void> {
    await this.rollbackTest()
    if (this.dataSource.isInitialized) await this.dataSource.destroy()

    if (!this.controlDataSource.isInitialized) await this.controlDataSource.initialize()
    await this.controlDataSource.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`)
    await this.controlDataSource.destroy()
  }

  private async initialize (): Promise<void> {
    await this.controlDataSource.initialize()
    await this.controlDataSource.query(`CREATE SCHEMA IF NOT EXISTS "${this.schema}"`)
    await this.controlDataSource.destroy()
    await this.dataSource.initialize()
    await this.dataSource.synchronize()
  }
}

/** Two independent connections for real row-lock and lease races. */
export class PostgresConcurrentTestSetup {
  private readonly runners: QueryRunner[] = []
  private readonly backendPids: number[] = []

  private constructor (public readonly dataSource: DataSource) {}

  public static async create (dataSource: DataSource): Promise<PostgresConcurrentTestSetup> {
    const setup = new PostgresConcurrentTestSetup(dataSource)
    await setup.openRunner()
    await setup.openRunner()

    if (setup.backendPids[0] === setup.backendPids[1]) {
      throw new Error('Concurrency tests require two distinct PostgreSQL backends')
    }

    return setup
  }

  public managerFor (worker: 0 | 1): EntityManager {
    return this.runners[worker].manager
  }

  public backendPidFor (worker: 0 | 1): number {
    return this.backendPids[worker]
  }

  public async inTransactionFor<T> (
    worker: 0 | 1,
    run: (manager: EntityManager) => Promise<T>
  ): Promise<T> {
    const runner = this.runners[worker]
    await runner.startTransaction()

    try {
      const result = await run(runner.manager)
      await runner.commitTransaction()

      return result
    } catch (error) {
      await runner.rollbackTransaction()
      throw error
    }
  }

  public async isBlocked (worker: 0 | 1): Promise<boolean> {
    const observer = worker === 0 ? 1 : 0
    const rows = await this.runners[observer].query(
      'SELECT cardinality(pg_blocking_pids($1)) > 0 AS waiting',
      [this.backendPidFor(worker)]
    ) as Array<{ waiting: boolean }>

    return rows[0].waiting
  }

  public async teardown (): Promise<void> {
    await Promise.all(this.runners.map(async runner => {
      if (runner.isTransactionActive) await runner.rollbackTransaction()
      await runner.release()
    }))
  }

  private async openRunner (): Promise<void> {
    const runner = this.dataSource.createQueryRunner()
    await runner.connect()
    const rows = await runner.query('SELECT pg_backend_pid() AS pid') as Array<{ pid: number }>
    this.runners.push(runner)
    this.backendPids.push(rows[0].pid)
  }
}

function safeSchemaName (packageName: string, workerId = process.env.VITEST_POOL_ID ?? '0'): string {
  const readable = `${packageName}_${workerId}`.toLowerCase().replace(/[^a-z0-9_]+/g, '_')
  const hash = createHash('sha256').update(`${packageName}:${workerId}`).digest('hex').slice(0, 8)

  return `test_${readable.slice(0, 40)}_${hash}`
}
