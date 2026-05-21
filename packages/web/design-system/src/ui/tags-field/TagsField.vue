<script setup lang="ts">
import {
  AnimatePresence,
  Motion,
  MotionConfig,
} from 'motion-v'
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
import FieldWrapperIcon from '@/ui/field-wrapper/FieldWrapperIcon.vue'
import FieldWrapperLoader from '@/ui/field-wrapper/FieldWrapperLoader.vue'
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
  addOnPaste: true,
  allowDuplicate: false,
  delimiter: ',',
  max: null,
  size: 'md',
})

const modelValue = defineModel<string[]>({
  required: true,
})

const id = props.id ?? useId()

const attrs = useAttrs()

const tagsFieldStyle = computed<TagsFieldStyle>(() => createTagsFieldStyle({
  size: props.size,
}))

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
      :data-readonly="props.isReadonly || undefined"
      :data-interactive="(!props.isDisabled && !props.isReadonly) || undefined"
      :class="{
        'py-1.25': props.size === 'md',
        'py-0.75': props.size === 'sm',
      }"
      class="
        flex flex-wrap items-center gap-xs rounded-md border border-secondary
        bg-primary px-xs outline outline-transparent duration-100
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
      />

      <slot name="left" />

      <RekaTagsInputRoot
        v-model="modelValue"
        :disabled="props.isDisabled"
        :max="props.max ?? undefined"
        :add-on-paste="props.addOnPaste"
        :delimiter="props.delimiter"
        :allow-duplicate="props.allowDuplicate"
        class="contents"
      >
        <TagsFieldTag
          v-for="tag in modelValue"
          :key="tag"
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
        />
      </RekaTagsInputRoot>

      <slot name="right" />

      <MotionConfig
        :transition="{
          duration: 0.2,
        }"
      >
        <AnimatePresence mode="popLayout">
          <Motion
            v-if="props.isLoading"
            :initial="{
              opacity: 0,
              scale: 0.9,
              filter: 'blur(2px)',
            }"
            :animate="{
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
            }"
            :exit="{
              opacity: 0,
              scale: 0.9,
              filter: 'blur(2px)',
            }"
          >
            <FieldWrapperLoader />
          </Motion>
        </AnimatePresence>
      </MotionConfig>
    </div>
  </InputWrapper>
</template>
