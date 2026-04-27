import type { Ref } from 'vue'
import { computed } from 'vue'

import type { DisplayFn } from '@/ui/select/select.props'
import type {
  SelectOptionItem,
  SelectValue,
} from '@/ui/select/select.type'

export function useSelectValue<TValue extends SelectValue | SelectValue[]>(
  modelValue: Ref<TValue | TValue[]>,
  displayFn: DisplayFn<TValue>,
) {
  function isMultiple(value: TValue | TValue[]): value is TValue[] {
    return Array.isArray(value)
  }

  const selectedOptions = computed<SelectOptionItem<TValue>[]>(() => {
    if (isMultiple(modelValue.value)) {
      return modelValue.value.map((value) => ({
        type: 'option',
        value,
      }))
    }

    if (modelValue.value === null) {
      return []
    }

    return [
      {
        type: 'option',
        value: modelValue.value,
      },
    ]
  })

  const valueLabel = computed<string | null>(() => {
    if (modelValue.value === null) {
      return null
    }

    if (isMultiple(modelValue.value)) {
      if (modelValue.value.length === 1) {
        return displayFn(modelValue.value[0] as any)
      }

      return `${modelValue.value.length} selected`
    }

    return displayFn(modelValue.value as any)
  })

  return {
    isMultiple,
    selectedOptions,
    valueLabel,
  }
}
