import type { ComputedRef } from 'vue'
import { computed } from 'vue'

export type NonUndefined<T> = {
  [K in keyof T]-?: Exclude<T[K], undefined>;
}

export interface TestId {
  /**
   * A unique identifier used for testing purposes. If set to `null`, no test ID will be applied.
   * @default null
   */
  testId?: string | null
}

export interface InteractableElement {
  /**
   * Determines whether the element is disabled. When `true`, the element becomes non-interactive.
   * @default false
   */
  isDisabled?: boolean
}

export interface FormElement {
  /**
   * The id of the element. If set to `null`, no ID will be applied.
   * @default null
   */
  id?: string | null
  /**
   * Whether the input is required.
   * @default false
   */
  isRequired?: boolean
  /**
   * Whether the input is touched. Used to determine if an error should be shown.
   * @default false
   */
  isTouched?: boolean
  /**
   * The error associated with the input.
   * @default null
   */
  errorMessage?: string | null
  /**
   * The hint text of the input.
   * @default null
   */
  hint?: string | null
  /**
   * The label of the input.
   * @default null
   */
  label?: string | null
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
