<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  useAttrs,
  useId,
  useTemplateRef,
  watch,
} from 'vue'

import { useInput } from '@/composables/input.composable'
import {
  AUTOCOMPLETE_INPUT_DEFAULTS,
  INPUT_DEFAULTS,
  INPUT_META_DEFAULTS,
} from '@/types/input.type'
import InputWrapper from '@/ui/input-wrapper/InputWrapper.vue'
import type { TextareaFieldProps } from '@/ui/textarea-field/textareaField.props'
import type { TextareaFieldStyle } from '@/ui/textarea-field/textareaField.style'
import { createTextareaFieldStyle } from '@/ui/textarea-field/textareaField.style'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TextareaFieldProps>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_META_DEFAULTS,
  ...AUTOCOMPLETE_INPUT_DEFAULTS,
  isSpellCheckEnabled: false,
  maxHeight: null,
  maxLength: null,
  minHeight: null,
  placeholder: null,
  resize: 'none',
})

const modelValue = defineModel<string | null>({
  required: true,
})

const textareaFieldStyle = computed<TextareaFieldStyle>(() => createTextareaFieldStyle({
  resize: props.resize,
}))

const textareaRef = useTemplateRef('textarea')

const attrs = useAttrs()

const id = props.id ?? useId()

const characterCountHint = computed<string | null>(() => {
  if (props.maxLength == null) {
    return null
  }

  const currentLength = modelValue.value?.length ?? 0

  return `${currentLength}/${props.maxLength}`
})

const resolvedHint = computed<string | null>(() => {
  return characterCountHint.value ?? props.hint
})

const {
  isError,
  ariaDescribedBy,
  ariaInvalid,
  ariaRequired,
} = useInput(id, props)

const textareaStyle = computed<Record<string, string | undefined>>(() => ({
  maxHeight: props.maxHeight ?? undefined,
  minHeight: props.minHeight ?? undefined,
}))

function adjustHeight(): void {
  const el = textareaRef.value

  if (el == null || props.resize !== 'auto-vertical') {
    return
  }

  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

watch(() => modelValue.value, async () => {
  await nextTick()
  adjustHeight()
}, {
  immediate: true,
})

onMounted(() => {
  adjustHeight()
})

onMounted(() => {
  adjustHeight()
})
</script>

<template>
  <InputWrapper
    :error-message="props.errorMessage"
    :is-disabled="props.isDisabled"
    :is-required="props.isRequired"
    :disabled-reason="props.disabledReason"
    :hint="resolvedHint"
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

    <div
      :data-error="isError || undefined"
      :data-disabled="props.isDisabled || undefined"
      :data-interactive="(!props.isDisabled && !props.isReadonly) || undefined"
      :class="textareaFieldStyle.root()"
    >
      <slot name="top" />

      <textarea
        v-bind="attrs"
        :id="id"
        ref="textarea"
        :value="modelValue"
        :aria-describedby="ariaDescribedBy"
        :autocomplete="props.autocomplete ?? undefined"
        :name="props.name ?? undefined"
        :aria-required="ariaRequired"
        :readonly="props.isReadonly"
        :aria-invalid="ariaInvalid"
        :disabled="props.isDisabled"
        :maxlength="props.maxLength ?? undefined"
        :placeholder="props.placeholder ?? undefined"
        :spellcheck="props.isSpellCheckEnabled"
        :style="textareaStyle"
        :class="textareaFieldStyle.textarea()"
        class="min-h-20 px-md py-sm"
        @input="(event) => modelValue = (event.target as HTMLTextAreaElement).value"
      />

      <slot name="bottom" />
    </div>
  </InputWrapper>
</template>
