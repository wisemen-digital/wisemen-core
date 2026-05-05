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

import { useInlineInput } from '@/composables/input.composable'
import {
  AUTOCOMPLETE_INPUT_DEFAULTS,
  INLINE_FIELD_DEFAULTS,
  INPUT_DEFAULTS,
} from '@/types/input.type'
import InlineFieldWrapper from '@/ui/inline-field-wrapper/InlineFieldWrapper.vue'
import type { InlineTextareaFieldProps } from '@/ui/inline-textarea-field/inlineTextareaField.props'
import type { InlineTextareaFieldStyle } from '@/ui/inline-textarea-field/inlineTextareaField.style'
import { createInlineTextareaFieldStyle } from '@/ui/inline-textarea-field/inlineTextareaField.style'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<InlineTextareaFieldProps>(), {
  ...INPUT_DEFAULTS,
  ...AUTOCOMPLETE_INPUT_DEFAULTS,
  ...INLINE_FIELD_DEFAULTS,
  isSpellCheckEnabled: false,
  maxHeight: null,
  minHeight: null,
  placeholder: null,
  resize: 'none',
  size: 'md',
})

const modelValue = defineModel<string | null>({
  required: true,
})

const inlineTextareaFieldStyle = computed<InlineTextareaFieldStyle>(() => createInlineTextareaFieldStyle({
  resize: props.resize,
  size: props.size,
}))

const textareaRef = useTemplateRef('textarea')
const attrs = useAttrs()
const id = props.id ?? useId()

const {
  isError,
  ariaDescribedBy,
  ariaInvalid,
  ariaRequired,
} = useInlineInput(id, props)

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

defineExpose({
  textarea: textareaRef,
})
</script>

<template>
  <InlineFieldWrapper
    :id="id"
    :is-error="isError"
    :is-disabled="props.isDisabled"
    :is-readonly="props.isReadonly"
    :error-message="props.errorMessage"
    :label="props.label"
    :variant="props.variant"
    :class="props.class"
    :style="props.style"
  >
    <template #left>
      <slot name="left" />
    </template>

    <template #right>
      <slot name="right" />
    </template>

    <textarea
      v-bind="attrs"
      :id="id"
      ref="textarea"
      :value="modelValue"
      :aria-describedby="ariaDescribedBy"
      :aria-invalid="ariaInvalid"
      :aria-required="ariaRequired"
      :autocomplete="props.autocomplete ?? undefined"
      :disabled="props.isDisabled"
      :name="props.name ?? undefined"
      :placeholder="props.placeholder ?? undefined"
      :readonly="props.isReadonly"
      :spellcheck="props.isSpellCheckEnabled"
      :style="textareaStyle"
      :class="inlineTextareaFieldStyle.textarea()"
      data-field-wrapper
      @input="(event) => modelValue = (event.target as HTMLTextAreaElement).value"
    />
  </InlineFieldWrapper>
</template>
