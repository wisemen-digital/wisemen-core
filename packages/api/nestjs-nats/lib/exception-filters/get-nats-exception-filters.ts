import type { Type } from '@nestjs/common'
import type { MethodName } from '#src/parameters/nats-parameter.js'
import type { ProvidersExplorer } from '#src/providers/providers-explorer.js'
import type { NatsExceptionFilter, ResolvedNatsExceptionFilter } from './nats-exception-filter.js'

type FilterMetadata = NatsExceptionFilter | Type<NatsExceptionFilter>
const EXCEPTION_FILTERS_METADATA = '__exceptionFilters__'
const FILTER_CATCH_EXCEPTIONS = '__filterCatchExceptions__'

export function getNatsExceptionFilters (
  providersExplorer: ProvidersExplorer,
  target: Type<unknown>,
  methodName?: MethodName
): ResolvedNatsExceptionFilter[] {
  const classFilters = getExceptionFilterMetadata(target)
  const methodFilters = methodName === undefined
    ? []
    : getExceptionFilterMetadata(target.prototype[methodName] as object)

  return [...methodFilters, ...classFilters].map(filter => resolveExceptionFilter(providersExplorer, filter))
}

function getExceptionFilterMetadata (target: object): FilterMetadata[] {
  return Reflect.getMetadata(EXCEPTION_FILTERS_METADATA, target) as FilterMetadata[] ?? []
}

function resolveExceptionFilter (
  providersExplorer: ProvidersExplorer,
  filterMetadata: FilterMetadata
): ResolvedNatsExceptionFilter {
  const filter = typeof filterMetadata === 'function'
    ? providersExplorer.getProviderInstance(filterMetadata) ?? new filterMetadata()
    : filterMetadata

  return {
    exceptions: Reflect.getMetadata(FILTER_CATCH_EXCEPTIONS, filter.constructor) as Type<unknown>[] ?? [],
    filter
  }
}
