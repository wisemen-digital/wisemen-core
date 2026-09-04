import { Span } from '@opentelemetry/api'
import { captureException } from './capture-exception.js'
import { getOtelTracer } from './get-otel-tracer.js'
import 'reflect-metadata'

const TRACE_KEY = 'wisemen.trace'

export function Trace (): MethodDecorator {
  return function (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const tracedMethods = (Reflect.getMetadata(TRACE_KEY, target) as string[] | undefined) ?? []

    if (tracedMethods.includes(propertyKey.toString())) {
      return
    }

    const originalMethod = descriptor.value as (...args: unknown[]) => unknown

    descriptor.value = function (...args: unknown[]): unknown {
      const trace = getOtelTracer()
      const className = target.constructor.name

      return trace.startActiveSpan(className + '.' + propertyKey.toString(), async (span: Span) => {
        try {
          return await originalMethod.apply(this, args)
        } catch (err) {
          captureException(err)

          throw err
        } finally {
          span.end()
        }
      })
    }

    tracedMethods.push(propertyKey.toString())
    Reflect.defineMetadata(TRACE_KEY, tracedMethods, target)

    return descriptor
  }
}
