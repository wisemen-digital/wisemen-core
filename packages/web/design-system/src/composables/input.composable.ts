import { computed } from 'vue'

import type {
  FieldWrapper,
  Input,
  InputWrapper,
} from '@/types/input.type'

export function useInlineInput(id: string, options: Input & FieldWrapper & { errorMessage?: string | null }) {
  const ariaDescribedBy = computed<string | undefined>(() =>
    options.errorMessage ? `${id}-error-message` : undefined)

  const ariaInvalid = computed<'true' | undefined>(() =>
    options.errorMessage ? 'true' : undefined)

  const ariaRequired = computed<'true' | undefined>(() =>
    options.isRequired ? 'true' : undefined)

  const ariaBusy = computed<'true' | undefined>(() =>
    options.isLoading ? 'true' : undefined)

  const isError = computed<boolean>(() =>
    Boolean(options.errorMessage))

  return {
    isError,
    ariaBusy,
    ariaDescribedBy,
    ariaInvalid,
    ariaRequired,
  }
}

export function useInput(id: string, options: Input & InputWrapper & FieldWrapper) {
  const ariaDescribedBy = computed<string | undefined>(() => {
    if (options.errorMessage === null && options.hint === null) {
      return
    }

    const ids: string[] = []

    if (options.errorMessage !== null) {
      ids.push(`${id}-error-message`)
    }

    if (options.hint !== null) {
      ids.push(`${id}-hint`)
    }

    return ids.join(' ')
  })

  const ariaInvalid = computed<'true' | undefined>(() => {
    return options.errorMessage ? 'true' : undefined
  })

  const ariaRequired = computed<'true' | undefined>(() => {
    return options.isRequired ? 'true' : undefined
  })

  const ariaBusy = computed<'true' | undefined>(() => {
    return options.isLoading ? 'true' : undefined
  })

  const isError = computed<boolean>(() => (
    options.errorMessage !== undefined && options.errorMessage !== null
  ))

  return {
    isError,
    ariaBusy,
    ariaDescribedBy,
    ariaInvalid,
    ariaRequired,
  }
}
