<script setup lang="ts">
import { computed } from 'vue'

import type { FormFieldGridProps } from '@/ui/field/formFieldGrid.props'

const props = withDefaults(defineProps<FormFieldGridProps>(), {
  variant: 'ghost',
})

const md = computed<1 | 2 | 3>(() => props.md ?? props.lg)
</script>

<template>
  <div
    :class="{
      'rounded-2xl bg-secondary p-2xl': props.variant === 'card',
    }"
    class="@container/form-field-grid w-full"
  >
    <div
      :class="{
        'grid-cols-1': props.sm === 1,
        'grid-cols-2': props.sm === 2,
        'grid-cols-3': props.sm === 3,
        '@md/form-field-grid:grid-cols-1': md === 1,
        '@md/form-field-grid:grid-cols-2': md === 2,
        '@md/form-field-grid:grid-cols-3': md === 3,
        '@lg/form-field-grid:grid-cols-1': props.lg === 1,
        '@lg/form-field-grid:grid-cols-2': props.lg === 2,
        '@lg/form-field-grid:grid-cols-3': props.lg === 3,
      }"
      class="grid gap-lg"
      role="group"
    >
      <slot />
    </div>
  </div>
</template>
