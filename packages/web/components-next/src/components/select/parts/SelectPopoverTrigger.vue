<script setup lang="ts">
import { computed } from 'vue'

import PopoverTrigger from '@/components/popover/parts/PopoverTrigger.vue'
import { useInjectSelectContext } from '@/components/select/select.context'
import InteractableElement from '@/components/shared/InteractableElement.vue'

const {
  id,
  hasInlineSearchInput,
  isDisabled,
  isDropdownVisible,
  displayFn,
  filter,
  modelValue,
  setIsDropdownVisible,
} = useInjectSelectContext()

const isTriggerFocusable = computed<boolean>(() => {
  if (filter.value === null) {
    return true
  }

  return !filter.value.isEnabled || !filter.value.isInline
})

function openDropdown(): void {
  setIsDropdownVisible(true)
}
</script>

<template>
  <InteractableElement :is-disabled="isDisabled">
    <PopoverTrigger>
      <button
        :id="hasInlineSearchInput ? undefined : id ?? undefined"
        :tabindex="isTriggerFocusable ? 0 : -1"
        :aria-expanded="isDropdownVisible"
        :aria-controls="`${id}-content`"
        :class="{
          'cursor-not-allowed': isDisabled,
        }"
        role="combobox"
        class="absolute inset-0 outline-none"
        @keydown.arrow-down.prevent="openDropdown"
        @keydown.arrow-up.prevent="openDropdown"
      >
        <span
          v-if="Array.isArray(modelValue)"
          class="sr-only"
        >
          {{ modelValue.map(displayFn).join(', ') }}
        </span>

        <span
          v-else-if="modelValue !== null"
          class="sr-only"
        >
          {{ displayFn(modelValue) }}
        </span>
      </button>
    </PopoverTrigger>
  </InteractableElement>
</template>
