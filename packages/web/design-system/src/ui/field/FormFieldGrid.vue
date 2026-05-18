<script setup lang="ts">
import type { FormFieldGridProps } from '@/ui/field/formFieldGrid.props'

const props = withDefaults(defineProps<FormFieldGridProps>(), {
  md: 1,
  variant: 'ghost',
})
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
        '@md/form-field-grid:grid-cols-1': props.md === 1,
        '@md/form-field-grid:grid-cols-2': props.md === 2,
        '@md/form-field-grid:grid-cols-3': props.md === 3,
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
