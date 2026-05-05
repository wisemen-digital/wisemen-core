<script setup lang="ts">
import { AlertCircleIcon } from '@wisemen/vue-core-icons'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import FieldWrapperIcon from '@/ui/field-wrapper/FieldWrapperIcon.vue'
import type { InlineFieldWrapperProps } from '@/ui/inline-field-wrapper/inlineFieldWrapper.props'
import { createInlineFieldWrapperStyle } from '@/ui/inline-field-wrapper/inlineFieldWrapper.style'

const props = withDefaults(defineProps<InlineFieldWrapperProps>(), {
  isDisabled: false,
  isError: false,
  isLoading: false,
  isReadonly: false,
  errorMessage: null,
  iconLeft: null,
  iconRight: null,
  label: null,
  variant: 'primary',
})
</script>

<template>
  <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
  <label
    v-if="props.label"
    :for="props.id"
    class="sr-only"
  >
    {{ props.label }}
  </label>

  <div
    :data-error="props.isError || undefined"
    :data-disabled="props.isDisabled || undefined"
    :data-readonly="props.isReadonly || undefined"
    :data-interactive="(!props.isDisabled && !props.isReadonly) || undefined"
    :class="createInlineFieldWrapperStyle({
      variant: props.variant,
    })"
  >
    <FieldWrapperIcon
      v-if="props.iconLeft"
      :icon="props.iconLeft"
      class="mr-xs"
    />

    <slot name="left" />

    <slot />

    <slot name="right" />

    <FieldWrapperIcon
      v-if="props.iconRight && !props.isLoading"
      :icon="props.iconRight"
      class="ml-xs"
    />

    <ActionTooltip
      v-if="props.isError"
      :label="props.errorMessage"
      :is-disabled="props.errorMessage === null"
    >
      <AlertCircleIcon
        class="ml-xs size-4 shrink-0 text-fg-error-primary"
        aria-hidden="true"
      />
    </ActionTooltip>

    <span
      v-if="props.errorMessage"
      :id="`${props.id}-error-message`"
      class="sr-only"
      role="alert"
      aria-live="assertive"
    >
      {{ props.errorMessage }}
    </span>
  </div>
</template>
