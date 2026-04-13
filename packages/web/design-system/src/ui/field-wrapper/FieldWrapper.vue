<script setup lang="ts">
import { INPUT_FIELD_DEFAULTS } from '@/types/input.type'
import type { FieldWrapperProps } from '@/ui/field-wrapper/fieldWrapper.props'
import FieldWrapperIcon from '@/ui/field-wrapper/FieldWrapperIcon.vue'
import FieldWrapperLoader from '@/ui/field-wrapper/FieldWrapperLoader.vue'
import { UIRowLayout } from '@/ui/row-layout/index'

// Wrapper component for TextField, NumberField, DateField, Select, etc

const props = withDefaults(defineProps<FieldWrapperProps>(), {
  ...INPUT_FIELD_DEFAULTS,
  isError: false,
  size: 'md',
})
</script>

<template>
  <UIRowLayout
    :data-error="props.isError || undefined"
    :data-disabled="props.isDisabled || undefined"
    :data-readonly="props.isReadonly || undefined"
    :data-interactive="(!props.isDisabled && !props.isReadonly) || undefined"
    :class="{
      'h-8': props.size === 'md',
      'h-7': props.size === 'sm',
    }"
    gap="none"
    class="
      group/field-wrapper relative rounded-md border border-primary bg-primary
      outline outline-transparent duration-100
      data-disabled:cursor-not-allowed data-disabled:border-disabled-subtle
      data-disabled:bg-disabled-subtle data-disabled:text-disabled
      data-error:border-error
      not-data-error:data-interactive:hover:border-primary
      [&:has([data-field-wrapper]:focus-visible)]:data-interactive:border-fg-brand-primary
      [&:has([data-field-wrapper]:focus-visible)]:data-interactive:outline-fg-brand-primary
      [&:has([data-field-wrapper]:focus-visible)]:data-interactive:data-error:border-error
      [&:has([data-field-wrapper]:focus-visible)]:data-interactive:data-error:outline-fg-error-primary
    "
  >
    <FieldWrapperIcon
      v-if="props.iconLeft"
      :icon="props.iconLeft"
      :input-field-size="props.size"
      :class="{
        'ml-md': props.size === 'md',
        'ml-sm': props.size === 'sm',
      }"
      class="text-error-500"
    />

    <slot name="left" />

    <slot />

    <slot name="right" />

    <FieldWrapperIcon
      v-if="props.iconRight"
      :icon="props.iconRight"
      :input-field-size="props.size"
      :class="{
        'mr-md': props.size === 'md',
        'mr-sm': props.size === 'sm',
      }"
    />

    <FieldWrapperLoader v-if="props.isLoading" />
  </UIRowLayout>
</template>
