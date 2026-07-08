<script setup lang="ts">
import {
  TagsInputInput as RekaTagsInputInput,
  TagsInputRoot as RekaTagsInputRoot,
} from 'reka-ui'
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
  omit,
} from '@/types/input.type'
import FieldWrapper from '@/ui/field-wrapper/FieldWrapper.vue'
import InputWrapper from '@/ui/input-wrapper/InputWrapper.vue'
import type { TagsFieldProps } from '@/ui/tags-field/tagsField.props'
import type { TagsFieldStyle } from '@/ui/tags-field/tagsField.style'
import { createTagsFieldStyle } from '@/ui/tags-field/tagsField.style'

import TagsFieldTag from './TagsFieldTag.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TagsFieldProps>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_META_DEFAULTS,
  ...omit(INPUT_FIELD_DEFAULTS, 'iconRight'),
  isAddedOnBlur: false,
  isAddedOnPaste: true,
  isAddedOnTab: false,
  isDuplicateAllowed: false,
  addOnBlur: false,
  addOnPaste: true,
  addOnTab: false,
  allowDuplicate: false,
  delimiter: ',',
  max: null,
  size: 'md',
})

const emit = defineEmits<{
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const modelValue = defineModel<string[]>({
  required: true,
})

const id = props.id ?? useId()

const attrs = useAttrs()

const tagsFieldStyle = computed<TagsFieldStyle>(() => createTagsFieldStyle({
  size: props.size,
}))

const isAddedOnBlur = computed<boolean>(() => props.isAddedOnBlur || props.addOnBlur)
const isAddedOnPaste = computed<boolean>(
  () => props.addOnPaste !== true ? false : props.isAddedOnPaste,
)
const isAddedOnTab = computed<boolean>(() => props.isAddedOnTab || props.addOnTab)
const isDuplicateAllowed = computed<boolean>(() => props.isDuplicateAllowed || props.allowDuplicate)

const {
  isError,
  ariaBusy,
  ariaDescribedBy,
  ariaInvalid,
  ariaRequired,
} = useInput(id, props)
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
    :is-error-message-hidden="props.isErrorMessageHidden"
  >
    <template #label-left>
      <slot name="label-left" />
    </template>

    <template #label-right>
      <slot name="label-right" />
    </template>

    <FieldWrapper
      :is-error="isError"
      :is-disabled="props.isDisabled"
      :is-loading="props.isLoading"
      :is-readonly="props.isReadonly"
      :icon-left="props.iconLeft"
      :wrap="true"
      :size="props.size"
      gap="xs"
    >
      <template #left>
        <slot name="left" />
      </template>

      <RekaTagsInputRoot
        v-model="modelValue"
        :disabled="props.isDisabled"
        :read-only="props.isReadonly"
        :max="props.max ?? undefined"
        :add-on-blur="isAddedOnBlur"
        :add-on-paste="isAddedOnPaste"
        :add-on-tab="isAddedOnTab"
        :delimiter="props.delimiter"
        :allow-duplicate="isDuplicateAllowed"
        class="contents"
      >
        <TagsFieldTag
          v-for="(tag, index) in modelValue"
          :key="index"
          :value="tag"
          :is-disabled="props.isDisabled"
          :is-readonly="props.isReadonly"
        />

        <RekaTagsInputInput
          v-bind="attrs"
          :id="id"
          :disabled="props.isDisabled"
          :readonly="props.isReadonly"
          :placeholder="modelValue.length === 0 ? (props.placeholder ?? undefined) : undefined"
          :aria-describedby="ariaDescribedBy"
          :aria-required="ariaRequired"
          :aria-busy="ariaBusy"
          :aria-invalid="ariaInvalid"
          :class="tagsFieldStyle.input()"
          data-field-wrapper
          @blur="emit('blur', $event)"
          @focus="emit('focus', $event)"
        />
      </RekaTagsInputRoot>

      <template #right>
        <slot name="right" />
      </template>
    </FieldWrapper>
  </InputWrapper>
</template>
