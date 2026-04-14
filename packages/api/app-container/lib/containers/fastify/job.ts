import type { INestApplicationContext } from '@nestjs/common'
import { FastifyContainer } from './fastify.js'

export abstract class JobContainer extends FastifyContainer {
  abstract execute (nest: INestApplicationContext): Promise<void>

  protected async init (): Promise<void> {
    await super.init()

    await this.execute(this.nest!)

    await this.close()
  }
}
