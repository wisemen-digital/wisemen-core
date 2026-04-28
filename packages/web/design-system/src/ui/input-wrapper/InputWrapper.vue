<script setup lang="ts">
import { useAttrs } from 'vue'

import { INPUT_META_DEFAULTS } from '@/types/input.type'
import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import type { InputWrapperProps } from '@/ui/input-wrapper/inputWrapper.props'
import InputWrapperErrorMessage from '@/ui/input-wrapper/InputWrapperErrorMessage.vue'
import InputWrapperHint from '@/ui/input-wrapper/InputWrapperHint.vue'
import InputWrapperLabel from '@/ui/input-wrapper/InputWrapperLabel.vue'
import RowLayout from '@/ui/row-layout/RowLayout.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<InputWrapperProps>(), {
  ...INPUT_META_DEFAULTS,
})

const attrs = useAttrs()
</script>

<template>
  <ActionTooltip
    :is-disabled="!props.isDisabled || props.disabledReason == null"
    :label="props.disabledReason"
  >
    <div
      v-if="props.isHorizontal"
    >
      <RowLayout
        align="start"
      >
        <RowLayout class="h-4.5">
          <slot />
        </RowLayout>
        <div>
          <InputWrapperLabel
            v-bind="attrs"
            :label="props.label"
            :for="props.for"
            :is-required="props.isRequired"
            :is-horizontal="props.isHorizontal"
            :is-label-hidden="props.isLabelHidden"
            :help-text="props.helpText"
          >
            <template #left>
              <slot name="label-left" />
            </template>

            <template #right>
              <slot name="label-right" />
            </template>
          </InputWrapperLabel>

          <InputWrapperHint
            :hint="props.hint"
            :for="props.for"
          />

          <InputWrapperErrorMessage
            v-if="!props.hideErrorMessage"
            :error-message="props.errorMessage"
            :for="props.for"
          />
        </div>
      </RowLayout>
    </div>
    <div
      v-else
    >
      <InputWrapperLabel
        v-bind="attrs"
        :label="props.label"
        :for="props.for"
        :is-required="props.isRequired"
        :is-label-hidden="props.isLabelHidden"
        :help-text="props.helpText"
      >
        <template #left>
          <slot name="label-left" />
        </template>

        <template #right>
          <slot name="label-right" />
        </template>
      </InputWrapperLabel>

      <slot />

      <InputWrapperHint
        :hint="props.hint"
        :for="props.for"
      />

      <InputWrapperErrorMessage
        v-if="!props.hideErrorMessage"
        :error-message="props.errorMessage"
        :for="props.for"
      />
    </div>
  </ActionTooltip>
</template>
