import type {
  ComputedRef,
  InjectionKey,
} from 'vue'
import {
  computed,
  inject,
  provide,
} from 'vue'

export function useContext<TContext>(contextName: string) {
  const contextKey: InjectionKey<TContext> = Symbol(contextName)

  function useProvideContext(context: TContext): TContext {
    provide(contextKey, context)

    return context
  }

  function useInjectContext<
    TFallback extends TContext | null = TContext,
  >(fallback?: TFallback): TFallback extends null ? TContext | null : TContext {
    const context = inject(contextKey, fallback ?? undefined)

    if (context === undefined && fallback === undefined) {
      throw new Error(`${contextName} context is not provided.`)
    }

    return (context ?? null) as TFallback extends null ? TContext | null : TContext
  }

  return [
    useProvideContext,
    useInjectContext,
  ] as const
}

type IsFunction<T> = T extends (...args: any[]) => any ? true : false

export type PropsToComputed<T> = {
  [K in keyof Required<T>]: IsFunction<Exclude<T[K], undefined>> extends true
    ? T[K]
    : ComputedRef<Exclude<T[K], undefined>>;
}

export function toComputedRefs<T>(props: T): PropsToComputed<T> {
  const computedRefs: Partial<PropsToComputed<T>> = {}

  for (const key in props) {
    if (typeof props[key] === 'function') {
      computedRefs[key] = props[key] as any

      continue
    }

    computedRefs[key] = computed<any>(
      () => props[key as keyof T] as T[Extract<keyof T, string>],
    ) as any
  }

  return computedRefs as PropsToComputed<T>
}
