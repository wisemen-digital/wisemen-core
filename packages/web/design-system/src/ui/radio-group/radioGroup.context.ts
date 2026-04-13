import type { AcceptableValue } from 'reka-ui'
import type {
  ComputedRef,
  InjectionKey,
  Ref,
} from 'vue'
import {
  inject,
  provide,
} from 'vue'

interface RadioGroupContext {
  isDisabled: ComputedRef<boolean>
  modelValue: Ref<AcceptableValue>
  orientation: ComputedRef<'horizontal' | 'vertical'>
}

export const radioGroupContextKey: InjectionKey<RadioGroupContext> = Symbol('RadioGroupContextKey')

export function useProvideRadioGroupContext(context: RadioGroupContext): void {
  provide(radioGroupContextKey, context)
}

export function useInjectRadioGroupContext(): RadioGroupContext {
  const context = inject(radioGroupContextKey, null)

  if (context === null) {
    throw new Error('RadioGroupContext not provided')
  }

  return context
}
