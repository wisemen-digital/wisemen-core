import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
import { DiscoveryService, Reflector, ModuleRef } from '@nestjs/core'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper.js'
import { PGBOSS_JOB_HANDLER } from './job.decorator.js'
import { JobHandler } from './job-handler.js'

@Injectable()
export class JobRegistry implements OnModuleInit {
  private readonly logger = new Logger(JobRegistry.name)
  private handlers = new Map<string, InstanceWrapper<JobHandler>>()

  constructor (
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef
  ) {}

  onModuleInit () {
    const providers = this.discoveryService.getProviders() as InstanceWrapper<JobHandler>[]

    for (const wrapper of providers) {
      const { instance } = wrapper

      if (instance == null) {
        continue
      }

      const jobName = this.reflector.get<string>(PGBOSS_JOB_HANDLER, instance?.constructor)

      if (!jobName) {
        continue
      }

      if (!(instance.run instanceof Function)) {
        throw new Error(`JobHandler ${instance.constructor.name} does not implement run()`)
      }

      this.logger.log(`Registering job handler: ${jobName}`)
      this.handlers.set(jobName, wrapper)
    }
  }

  async get (jobName: string): Promise<JobHandler> {
    const wrapper = this.handlers.get(jobName)

    if (wrapper === undefined) {
      throw new Error(`No job handler found for job: ${jobName}`)
    }

    if ((!wrapper.isDependencyTreeStatic()) || wrapper.isTransient) {
      return await this.moduleRef.resolve(wrapper.metatype!, undefined, { strict: false })
    } else {
      return wrapper.instance
    }
  }
}
