import type { InjectionKey } from 'vue'
import {
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
