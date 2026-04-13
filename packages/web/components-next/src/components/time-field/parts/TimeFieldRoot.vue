<script setup lang="ts">
import { Time as TimeValue } from '@internationalized/date'
import { TimeFieldRoot as RekaTimeFieldRoot } from 'reka-ui'
import { Temporal } from 'temporal-polyfill'
import {
  computed,
  ref,
} from 'vue'

import type { CustomComponentVariant } from '@/class-variant/classVariant.type'
import {
  getCustomComponentVariant,
  mergeClasses,
} from '@/class-variant/customClassVariants'
import { useInjectConfigContext } from '@/components/config-provider/config.context'
import FormControl from '@/components/shared/FormControl.vue'
import TestIdProvider from '@/components/shared/TestIdProvider.vue'
import { injectThemeProviderContext } from '@/components/theme-provider/themeProvider.context'
import { useProvideTimeFieldContext } from '@/components/time-field/timeField.context'
import type { TimeFieldEmits } from '@/components/time-field/timeField.emits'
import type { TimeFieldProps } from '@/components/time-field/timeField.props'
import type { CreateTimeFieldStyle } from '@/components/time-field/timeField.style'
import { createTimeFieldStyle } from '@/components/time-field/timeField.style'
import { toComputedRefs } from '@/utils/props.util'

const props = withDefaults(defineProps<TimeFieldProps>(), {
  id: null,
  testId: null,
  maxDate: null,
  minDate: null,
  isDateDisabled: () => false,
  isDateUnavailable: () => false,
  isDisabled: false,
  isLoading: false,
  isRequired: false,
  isTouched: false,
  allowDeselect: false,
  autocomplete: 'off',
  classConfig: null,
  errorMessage: null,
  hideDatePicker: false,
  hint: null,
  iconLeft: null,
  iconRight: null,
  label: null,
  placeholder: null,
  showTwoMonths: false,
  variant: null,
})

const emit = defineEmits<TimeFieldEmits>()

const modelValue = defineModel<Temporal.PlainTime | null>({
  required: true,
})

const delegatedModel = computed<TimeValue | undefined>({
  get: () => {
    if (modelValue.value === null) {
      return
    }

    const {
      hour, minute,
    } = modelValue.value

    return new TimeValue(Number(hour), Number(minute))
  },
  set: (value) => {
    if (value === undefined) {
      modelValue.value = null

      return
    }

    const updatedValue = `${value.hour.toString().padStart(2, '0')}:${value.minute.toString().padStart(2, '0')}`

    modelValue.value = Temporal.PlainTime.from(updatedValue)
  },
})

const {
  hourCycle, locale,
} = useInjectConfigContext()
const {
  theme,
} = injectThemeProviderContext()

const isFocused = ref<boolean>(false)

const timeFieldStyle = computed<CreateTimeFieldStyle>(
  () => createTimeFieldStyle({
    variant: props.variant ?? undefined,
  }),
)

const customClassConfig = computed<CustomComponentVariant<'timeField'>>(
  () => getCustomComponentVariant('timeField', theme.value, {
    variant: props.variant,
  }),
)

const hourCycleValue = computed<12 | 24 | null>(() => {
  if (hourCycle.value === null) {
    return null
  }

  return hourCycle.value === '12-hour' ? 12 : 24
})

function onFocus(event: FocusEvent): void {
  isFocused.value = true
  emit('focus', event)
}

function onBlur(event: FocusEvent): void {
  isFocused.value = false

  // Since there are multiple inputs, it's possible that a blur event is triggered while navigating to another input
  // In this case, we don't want to emit the blur event since the focus is still within the component
  setTimeout(() => {
    if (!isFocused.value) {
      emit('blur', event)
    }
  })
}

useProvideTimeFieldContext({
  ...toComputedRefs(props),
  customClassConfig,
  modelValue,
  style: timeFieldStyle,
  onBlur,
  onFocus,
})
</script>

<template>
  <TestIdProvider :test-id="props.testId">
    <FormControl
      :id="props.id"
      :value="modelValue"
      :is-loading="isLoading"
      :is-disabled="isDisabled"
      :is-invalid="errorMessage !== null"
      :is-required="isRequired"
      :described-by="`${id}-error ${id}-hint`"
    >
      <RekaTimeFieldRoot
        v-slot="{ segments }"
        v-model="delegatedModel"
        :locale="locale"
        :required="props.isRequired"
        :is-invalid="props.errorMessage !== null"
        :hour-cycle="hourCycleValue ?? undefined"
      >
        <!-- For some reason, the data- bindings don't work on the `RekaTimeFieldRoot` component -->
        <div
          :data-icon-left="props.iconLeft !== null || undefined"
          :data-invalid="(props.errorMessage !== null && props.isTouched) || undefined"
          :data-disabled="props.isDisabled || undefined"
          :class="timeFieldStyle.root({
            class: mergeClasses(customClassConfig.root, props.classConfig?.root),
          })"
        >
          <slot :segments="segments" />
        </div>
      </RekaTimeFieldRoot>
    </FormControl>
  </TestIdProvider>
</template>
