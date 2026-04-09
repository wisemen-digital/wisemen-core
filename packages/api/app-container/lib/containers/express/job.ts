import type { INestApplicationContext } from '@nestjs/common'
import { ExpressContainer } from './express.js'

export abstract class JobContainer extends ExpressContainer {
  abstract execute (nest: INestApplicationContext): Promise<void>

  protected async init (): Promise<void> {
    await super.init()

    await this.execute(this.nest!)

    await this.close()
  }
}
