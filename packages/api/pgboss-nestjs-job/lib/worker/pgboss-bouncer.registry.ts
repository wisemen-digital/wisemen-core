import { Injectable, Logger } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper.js'
import { ProvidersExplorer } from '../providers/providers-explorer.js'
import { AllowBouncer, PgbossBouncer } from './pgboss-bouncer.js'
import { getPgbossBouncerQueueName, isPgbossBouncer } from './pgboss-bouncer.decorator.js'

@Injectable()
export class PgbossBouncerRegistry {
  private readonly logger = new Logger(PgbossBouncerRegistry.name)
  private bouncers = new Map<string, InstanceWrapper<PgbossBouncer>>()

  constructor (
    private moduleRef: ModuleRef,
    private providerExplorer: ProvidersExplorer
  ) {}

  onModuleInit () {
    for (const provider of this.providerExplorer.providers) {
      if (isPgbossBouncer(provider.providerClass)) {
        const queueName = getPgbossBouncerQueueName(provider.providerClass)

        this.bouncers.set(queueName, provider.instanceWrapper as InstanceWrapper<PgbossBouncer>)
        this.logger.log(`Registered pgboss bouncer ${provider.providerClass.name} for queue ${queueName}`)
      }
    }
  }

  async getBouncer (queueName: string): Promise<PgbossBouncer> {
    const wrapper = this.bouncers.get(queueName)

    if (wrapper === undefined) {
      return new AllowBouncer()
    }

    if ((!wrapper.isDependencyTreeStatic()) || wrapper.isTransient) {
      return await this.moduleRef.resolve(wrapper.metatype!, undefined, { strict: false })
    } else {
      return wrapper.instance
    }
  }
}
