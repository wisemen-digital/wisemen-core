<script setup lang="ts">
import {
  SwitchRoot as RekaSwitchRoot,
  SwitchThumb as RekaSwitchThumb,
} from 'reka-ui'
import { twMerge } from 'tailwind-merge'
import type { Component } from 'vue'
import {
  computed,
  useId,
} from 'vue'

import {
  INPUT_DEFAULTS,
  INPUT_META_DEFAULTS,
} from '@/types/input.type'
import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import InputWrapperErrorMessage from '@/ui/input-wrapper/InputWrapperErrorMessage.vue'
import InputWrapperHint from '@/ui/input-wrapper/InputWrapperHint.vue'
import { UIRowLayout } from '@/ui/row-layout/index'
import RowLayout from '@/ui/row-layout/RowLayout.vue'
import { useProvideSwitchContext } from '@/ui/switch/switch.context'
import type { SwitchProps } from '@/ui/switch/switch.props'
import type { SwitchStyle } from '@/ui/switch/switch.style'
import { createSwitchStyle } from '@/ui/switch/switch.style'
import SwitchThumbIcon from '@/ui/switch/SwitchThumbIcon.vue'
import { UIText } from '@/ui/text/index'

const props = withDefaults(defineProps<SwitchProps>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_META_DEFAULTS,
  iconChecked: null,
  iconUnchecked: null,
  size: 'md',
})

const emit = defineEmits<{
  blur: []
}>()

const modelValue = defineModel<boolean>({
  required: true,
})

const id = props.id ?? useId()

const switchStyle = computed<SwitchStyle>(() => createSwitchStyle({
  size: props.size,
}))

useProvideSwitchContext({
  isChecked: computed<boolean>(() => modelValue.value),
  iconChecked: computed<Component | null>(() => props.iconChecked ?? null),
  iconUnchecked: computed<Component | null>(() => props.iconUnchecked ?? null),
  switchStyle,
})
</script>

<template>
  <ActionTooltip
    :is-disabled="!props.isDisabled || props.disabledReason == null"
    :label="props.disabledReason"
  >
    <RowLayout
      align="start"
    >
      <RekaSwitchRoot
        :id="id"
        v-model="modelValue"
        :disabled="props.isDisabled"
        :data-invalid="(props.errorMessage !== null && props.errorMessage !== undefined) || undefined"
        :class="switchStyle.root()"
        @blur="emit('blur')"
      >
        <RekaSwitchThumb :class="switchStyle.thumb()">
          <SwitchThumbIcon />
        </RekaSwitchThumb>
      </RekaSwitchRoot>
      <div>
        <UIRowLayout
          v-if="props.label !== null"
          :class="[
            props.isLabelHidden && 'sr-only',
          ]"
          gap="none"
        >
          <slot name="left" />

          <UIText
            :for="props.for ?? undefined"
            :text="props.label"
            :class="twMerge(
              'text-xs/5 font-medium text-secondary',
              props.isRequired ? 'after:pl-xxs after:text-error-primary' : '',
            )"
            :data-label-required="props.isRequired ? '' : null"
            as="label"
          />

          <slot name="right" />
        </UIRowLayout>

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
  </ActionTooltip>
</template>
