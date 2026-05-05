<script setup lang="ts">
import { Time as TimeValue } from '@internationalized/date'
import {
  TimeFieldInput as RekaTimeFieldInput,
  TimeFieldRoot as RekaTimeFieldRoot,
} from 'reka-ui'
import { Temporal } from 'temporal-polyfill'
import {
  computed,
  useAttrs,
  useId,
} from 'vue'

import { useInput } from '@/composables/input.composable'
import {
  INPUT_DEFAULTS,
  INPUT_FIELD_DEFAULTS,
  INPUT_META_DEFAULTS,
} from '@/types/input.type'
import { useInjectConfigContext } from '@/ui/config-provider'
import FieldWrapper from '@/ui/field-wrapper/FieldWrapper.vue'
import InputWrapper from '@/ui/input-wrapper/InputWrapper.vue'
import type { TimeFieldProps } from '@/ui/time-field/timeField.props'
import { createTimeFieldStyle } from '@/ui/time-field/timeField.style'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TimeFieldProps>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_META_DEFAULTS,
  ...INPUT_FIELD_DEFAULTS,
  size: 'md',
})

const modelValue = defineModel<Temporal.PlainTime | null>({
  required: true,
})

const {
  hourCycle, locale,
} = useInjectConfigContext()

const id = props.id ?? useId()

const attrs = useAttrs()

const {
  isError,
  ariaDescribedBy,
  ariaInvalid,
} = useInput(id, props)

const timeFieldStyle = computed(() => createTimeFieldStyle({
  size: props.size,
}))

const hourCycleValue = computed<12 | 24 | undefined>(() => {
  if (hourCycle.value == null) {
    return
  }

  return hourCycle.value === '12-hour' ? 12 : 24
})

const timeValue = computed<TimeValue | undefined>({
  get: () => {
    if (modelValue.value === null) {
      return
    }

    return new TimeValue(Number(modelValue.value.hour), Number(modelValue.value.minute))
  },
  set: (value) => {
    if (value === undefined) {
      modelValue.value = null

      return
    }

    const str = `${value.hour.toString().padStart(2, '0')}:${value.minute.toString().padStart(2, '0')}`

    modelValue.value = Temporal.PlainTime.from(str)
  },
})
</script>

<template>
  <InputWrapper
    :error-message="props.errorMessage"
    :is-disabled="props.isDisabled"
    :is-required="props.isRequired"
    :disabled-reason="props.disabledReason"
    :hint="props.hint"
    :label="props.label"
    :class="props.class"
    :style="props.style"
    :for="id"
    :help-text="props.helpText"
    :hide-error-message="props.hideErrorMessage"
  >
    <template #label-left>
      <slot name="label-left" />
    </template>

    <template #label-right>
      <slot name="label-right" />
    </template>

    <FieldWrapper
      :is-disabled="props.isDisabled"
      :is-error="isError"
      :is-loading="props.isLoading"
      :is-readonly="props.isReadonly"
      :size="props.size"
    >
      <RekaTimeFieldRoot
        :id="id"
        v-slot="{ segments }"
        v-model="timeValue"
        v-bind="attrs"
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="ariaInvalid"
        :aria-required="props.isRequired || undefined"
        :class="timeFieldStyle.field()"
        :disabled="props.isDisabled"
        :hour-cycle="hourCycleValue"
        :is-invalid="isError"
        :locale="locale"
        :readonly="props.isReadonly"
        :required="props.isRequired"
      >
        <template
          v-for="{ part, value } in segments"
          :key="part"
        >
          <RekaTimeFieldInput
            v-if="part !== 'literal'"
            :part="part"
            :class="timeFieldStyle.segment()"
            data-field-wrapper
          >
            {{ value }}
          </RekaTimeFieldInput>

          <RekaTimeFieldInput
            v-else
            :part="part"
            :class="timeFieldStyle.literal()"
          >
            {{ value }}
          </RekaTimeFieldInput>
        </template>
      </RekaTimeFieldRoot>
    </FieldWrapper>
  </InputWrapper>
</template>
