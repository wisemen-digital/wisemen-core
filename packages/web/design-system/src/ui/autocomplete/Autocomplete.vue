<script setup lang="ts" generic="TValue extends AutocompleteValue">
import { ChevronDownIcon } from '@wisemen/vue-core-icons'
import {
  ComboboxAnchor as RekaComboboxAnchor,
  ComboboxInput as RekaComboboxInput,
  ComboboxRoot as RekaComboboxRoot,
} from 'reka-ui'
import {
  computed,
  useAttrs,
  useId,
} from 'vue'

import { useInput } from '@/composables/input.composable'
import {
  AUTOCOMPLETE_INPUT_DEFAULTS,
  INPUT_DEFAULTS,
  INPUT_FIELD_DEFAULTS,
  INPUT_META_DEFAULTS,
} from '@/types/input.type'
import { useProvideAutocompleteContext } from '@/ui/autocomplete/autocomplete.context'
import type { AutocompleteProps } from '@/ui/autocomplete/autocomplete.props'
import { createAutocompleteStyle } from '@/ui/autocomplete/autocomplete.style'
import type { AutocompleteValue } from '@/ui/autocomplete/autocomplete.type'
import AutocompleteContent from '@/ui/autocomplete/AutocompleteContent.vue'
import FieldWrapper from '@/ui/field-wrapper/FieldWrapper.vue'
import InputWrapper from '@/ui/input-wrapper/InputWrapper.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<AutocompleteProps<TValue>>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_META_DEFAULTS,
  ...INPUT_FIELD_DEFAULTS,
  ...AUTOCOMPLETE_INPUT_DEFAULTS,
  disableSideFlip: true,
  getItemConfig: null,
  iconRight: ChevronDownIcon,
  openOnClick: true,
  popoverAlign: 'center',
  popoverCollisionPadding: 8,
  popoverSide: 'bottom',
  popoverSideOffset: 4,
  popoverWidth: 'anchor-width',
  prioritizePosition: true,
  search: 'local',
  size: 'md',
})

const emit = defineEmits<{
  'blur': []
  'nextPage': []
  'update:search': [searchTerm: string]
}>()

const modelValue = defineModel<TValue | null>({
  required: true,
})

const id = props.id ?? useId()
const attrs = useAttrs()

const {
  isError,
  ariaBusy,
  ariaDescribedBy,
  ariaInvalid,
  ariaRequired,
} = useInput(id, props)

const autocompleteStyle = computed(() => createAutocompleteStyle({
  size: props.size,
}))

function displayValueFn(value: TValue | null): string {
  if (value == null) {
    return ''
  }

  return props.displayFn(value as NonNullable<TValue>)
}

function onOpenChange(isOpen: boolean): void {
  if (!isOpen) {
    emit('blur')
  }
}

useProvideAutocompleteContext({
  getItemConfig: props.getItemConfig ?? null,
  size: computed(() => props.size),
  onSelectOption: () => {},
})
</script>

<template>
  <InputWrapper
    :error-message="props.errorMessage"
    :is-disabled="props.isDisabled"
    :is-required="props.isRequired"
    :disabled-reason="props.disabledReason"
    :hint="props.hint"
    :help-text="props.helpText"
    :label="props.label"
    :class="props.class"
    :style="props.style"
    :for="id"
    :hide-error-message="props.hideErrorMessage"
  >
    <template #label-left>
      <slot name="label-left" />
    </template>

    <template #label-right>
      <slot name="label-right" />
    </template>

    <RekaComboboxRoot
      v-model="(modelValue as any)"
      :display-value="displayValueFn"
      :ignore-filter="true"
      :open-on-click="props.openOnClick"
      :disabled="props.isDisabled"
      class="block w-full"
      @update:open="onOpenChange"
    >
      <RekaComboboxAnchor class="block w-full">
        <FieldWrapper
          :icon-left="props.iconLeft"
          :icon-right="props.iconRight"
          :is-loading="props.isLoading"
          :is-error="isError"
          :is-disabled="props.isDisabled"
          :is-readonly="props.isReadonly"
          :size="props.size"
        >
          <template #left>
            <slot name="left" />
          </template>

          <template #right>
            <slot name="right" />
          </template>

          <RekaComboboxInput
            v-bind="attrs"
            :id="id"
            :name="props.name ?? undefined"
            :autocomplete="props.autocomplete ?? undefined"
            :placeholder="props.placeholder ?? undefined"
            :readonly="props.isReadonly"
            :disabled="props.isDisabled"
            :aria-describedby="ariaDescribedBy"
            :aria-required="ariaRequired"
            :aria-busy="ariaBusy"
            :aria-invalid="ariaInvalid"
            :class="autocompleteStyle.input()"
            data-field-wrapper
          />
        </FieldWrapper>
      </RekaComboboxAnchor>

      <AutocompleteContent
        :display-fn="props.displayFn"
        :is-loading="props.isLoading"
        :items="props.items"
        :search="props.search"
      />
    </RekaComboboxRoot>
  </InputWrapper>
</template>
