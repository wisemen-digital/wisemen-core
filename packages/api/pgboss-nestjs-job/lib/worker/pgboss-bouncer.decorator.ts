import type { ClassConstructor } from 'class-transformer'
import { applyDecorators, Injectable } from '@nestjs/common'

const PGBOSS_BOUNCER_TOKEN = Symbol('wisemen.pgboss-bouncer')

/**
 * A bouncer can prevent the worker from polling for jobs.
 * This bouncer needs to be part of the the queue module for which it is registered.
 *
 * When no bouncer is needed, or the it is misconfigured, the worker will default
 * to an allow bouncer (i.e. the bouncer never prevents the worker from polling for jobs).
 */
export function Bouncer (queueName: string): ClassDecorator {
  return applyDecorators(
    Injectable(),
    (target: ClassConstructor<unknown>): void => {
      Reflect.defineMetadata(PGBOSS_BOUNCER_TOKEN, queueName, target)
    }
  )
}

export function isPgbossBouncer (target: ClassConstructor<unknown>): boolean {
  return Reflect.getMetadata(PGBOSS_BOUNCER_TOKEN, target) !== undefined
}

export function getPgbossBouncerQueueName (target: ClassConstructor<unknown>): string {
  const queueName = Reflect.getMetadata(PGBOSS_BOUNCER_TOKEN, target) as string | undefined

  if (queueName === undefined) {
    throw new Error(
      `${target.name} is not a valid pgboss bouncer\n`
      + `Did you forget to add the @Bouncer(<queueName>) decorator?`
    )
  }

  return queueName
}
