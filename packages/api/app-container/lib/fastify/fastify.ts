/* eslint-disable no-console */
import type { INestApplicationContext } from '@nestjs/common'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import type { FastifyInstance, FastifyReply, FastifyRequest, FastifyServerOptions } from 'fastify'

const port = Number(process.env.PORT) || 3000

type State = 'starting' | 'ready' | 'shutdown' | 'unknown'

export abstract class FastifyContainer {
  private adapter?: FastifyAdapter
  private state: State
  private server: FastifyInstance

  protected nest?: INestApplicationContext
  protected getFastifyOptions (): FastifyServerOptions {
    return {}
  }

  abstract bootstrap (app: FastifyAdapter): Promise<INestApplicationContext>

  constructor () {
    this.state = 'starting'

    this.enableShutdownHooks()

    void this._init()
  }

  private async _init (): Promise<void> {
    try {
      await this.init()
    } catch (e) {
      await this.close()

      console.log(e)

      process.exit(1)
    }
  }

  protected async init (): Promise<void> {
    this.adapter = new FastifyAdapter(this.getFastifyOptions())

    this.server = this.adapter.getInstance()

    this.enableProbes()

    this.nest = await this.bootstrap(this.adapter)

    await this.nest.init()

    await this.server.listen({ port, host: '0.0.0.0' })
    console.log('server started')

    this.state = 'ready'
  }

  protected async close (): Promise<void> {
    if (this.state === 'shutdown') {
      return
    }

    this.state = 'shutdown'

    try {
      await this.server.close()
      await this.nest?.close()

      console.log('application closed')
    } catch (e) {
      console.error('error shutting down', e)

      process.exit(1)
    }
  }

  private enableShutdownHooks (): void {
    process.on('SIGTERM', () => void this.close())
    process.on('SIGINT', () => void this.close())
    process.on('SIGUSR2', () => void this.close())
    process.on('SIGHUP', () => void this.close())
    process.on('exit', () => void this.close())
  }

  private enableProbes (): void {
    if (this.server == null) return

    this.server.get('/', (_: FastifyRequest, res: FastifyReply) => {
      this.version(res)
    })
    this.server.get('/health', (_: FastifyRequest, res: FastifyReply) => {
      this.liveness(res)
    })
    this.server.get('/ready', (_: FastifyRequest, res: FastifyReply) => {
      this.readiness(res)
    })
  }

  private liveness (res: FastifyReply): void {
    res.status(200).type('text/plain').send('OK')
  }

  private readiness (res: FastifyReply): void {
    if (this.state === 'ready') {
      res.status(200).type('text/plain').send('OK')
    } else {
      res.status(500).type('text/plain').send('not OK')
    }
  }

  private version (res: FastifyReply): void {
    res.status(200).type('application/json').send({
      env: process.env.NODE_ENV,
      commit: process.env.COMMIT,
      build: process.env.BUILD_NUMBER,
      version: process.env.VERSION
    })
  }
}
